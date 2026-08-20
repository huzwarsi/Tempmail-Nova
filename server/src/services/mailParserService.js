const { simpleParser } = require('mailparser');
const Email = require('../models/Email');
const Inbox = require('../models/Inbox');
const Attachment = require('../models/Attachment');
const { calculateSpamScore, cleanHtml } = require('./spamFilter');
const { emitNewEmail } = require('./socketService');
const { v4: uuidv4 } = require('uuid');

/**
 * Parses raw MIME email stream/buffer and stores it in the MongoDB database.
 */
const parseAndSaveIncomingEmail = async (streamOrBuffer) => {
  try {
    const parsed = await simpleParser(streamOrBuffer);

    // Get recipients
    const toRecipients = Array.isArray(parsed.to) ? parsed.to.value : parsed.to?.value || [];
    if (!toRecipients || toRecipients.length === 0) {
      console.warn('[MailParser] No recipient found in incoming email');
      return null;
    }

    const recipientAddress = toRecipients[0].address.toLowerCase().trim();
    const senderAddress = parsed.from?.value?.[0]?.address || 'unknown@sender.com';
    const senderName = parsed.from?.value?.[0]?.name || parsed.from?.text || senderAddress;
    const subject = parsed.subject || '(No Subject)';
    const textBody = parsed.text || '';
    const dirtyHtml = parsed.html || parsed.textAsHtml || `<pre>${textBody}</pre>`;
    const htmlBody = cleanHtml(dirtyHtml);

    // Spam score check
    const { score: spamScore, isSpam } = calculateSpamScore(subject, textBody, senderAddress);

    // Calculate expiration date (same as inbox expiration or 24 hours default)
    const inbox = await Inbox.findOne({ address: recipientAddress });
    let expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours fallback

    if (inbox) {
      expiresAt = inbox.expiresAt;
      inbox.unreadCount += 1;
      inbox.totalReceived += 1;
      await inbox.save();
    }

    // Process attachments
    const processedAttachments = [];
    const attachmentDocPromises = [];

    if (parsed.attachments && parsed.attachments.length > 0) {
      for (const att of parsed.attachments) {
        const attachmentId = uuidv4();
        processedAttachments.push({
          filename: att.filename || `attachment_${attachmentId.slice(0, 8)}`,
          contentType: att.mimeType || 'application/octet-stream',
          size: att.size || att.content.length,
          contentId: att.cid || null,
          attachmentId,
        });

        // Create attachment database document
        attachmentDocPromises.push(
          Attachment.create({
            attachmentId,
            filename: att.filename || 'attachment',
            contentType: att.mimeType || 'application/octet-stream',
            size: att.size || att.content.length,
            content: att.content,
            emailId: null, // set after email doc creation
          })
        );
      }
    }

    // Create Email Record
    const newEmail = new Email({
      inboxAddress: recipientAddress,
      sender: {
        address: senderAddress,
        name: senderName,
      },
      recipients: toRecipients.map((r) => ({ address: r.address, name: r.name || '' })),
      subject,
      bodyText: textBody,
      bodyHtml: htmlBody,
      rawHeaders: parsed.headerLines ? JSON.stringify(parsed.headerLines) : '',
      attachments: processedAttachments,
      messageId: parsed.messageId || uuidv4(),
      size: parsed.html?.length || textBody.length,
      isRead: false,
      isSpam,
      spamScore,
      expiresAt,
    });

    const savedEmail = await newEmail.save();

    // Link emailId to attachments created
    if (attachmentDocPromises.length > 0) {
      const createdAttachments = await Promise.all(attachmentDocPromises);
      await Attachment.updateMany(
        { _id: { $in: createdAttachments.map((a) => a._id) } },
        { emailId: savedEmail._id }
      );
    }

    console.log(`[MailParser] Email successfully saved for inbox: ${recipientAddress}`);

    // Emit live WebSocket notification!
    emitNewEmail(recipientAddress, {
      _id: savedEmail._id,
      inboxAddress: savedEmail.inboxAddress,
      sender: savedEmail.sender,
      subject: savedEmail.subject,
      bodyText: savedEmail.bodyText.slice(0, 150) + '...',
      attachmentsCount: savedEmail.attachments.length,
      isRead: false,
      isSpam: savedEmail.isSpam,
      createdAt: savedEmail.createdAt,
    });

    return savedEmail;
  } catch (error) {
    console.error('[MailParser Error]:', error);
    throw error;
  }
};

module.exports = {
  parseAndSaveIncomingEmail,
};
