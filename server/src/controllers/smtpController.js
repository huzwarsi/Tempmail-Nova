/**
 * SMTP Incoming Email Controller
 *
 * This endpoint is called EXCLUSIVELY by the Haraka SMTP plugin (tempmail_deliver.js).
 * It receives the raw MIME email, parses it, stores it in MongoDB, and
 * instantly broadcasts the new email to connected Socket.io clients.
 *
 * Security: protected by SMTP_INTERNAL_SECRET header — not exposed to public internet.
 */

const { simpleParser } = require('mailparser');
const Email = require('../models/Email');
const Inbox = require('../models/Inbox');
const Attachment = require('../models/Attachment');
const Domain = require('../models/Domain');
const { cleanHtml, calculateSpamScore } = require('../services/spamFilter');
const { emitNewEmail } = require('../services/socketService');
const { v4: uuidv4 } = require('uuid');

/**
 * Auto-creates an inbox if it doesn't exist yet.
 * This enables unlimited disposable addresses — any address on a known domain is valid.
 */
const getOrCreateInbox = async (address) => {
  let inbox = await Inbox.findOne({ address });

  if (!inbox) {
    const parts = address.split('@');
    const username = parts[0];
    const domain = parts[1];

    const expirationHours = parseInt(process.env.MAX_INBOX_EXPIRATION_HOURS || '24', 10);
    const expiresAt = new Date(Date.now() + expirationHours * 60 * 60 * 1000);

    inbox = await Inbox.create({
      address,
      username,
      domain,
      expiresAt,
      totalReceived: 0,
      unreadCount: 0,
    });

    console.log(`[SMTP Controller] Auto-created inbox: ${address}`);
  }

  return inbox;
};

/**
 * POST /smtp/incoming
 * Called by Haraka plugin (or test-email.js locally) when a real email arrives.
 * Body is pre-buffered by express.raw() middleware.
 */
exports.receiveIncoming = async (req, res, next) => {
  try {
    // ── Security: verify internal secret header ──────────────────────────────
    const internalSecret = req.headers['x-internal-secret'];
    const expectedSecret = process.env.SMTP_INTERNAL_SECRET || 'haraka_internal_tempmail_secret';

    if (internalSecret !== expectedSecret) {
      console.warn('[SMTP Controller] Unauthorized SMTP delivery attempt rejected');
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    // ── Decode Haraka metadata ───────────────────────────────────────────────
    const metaBase64 = req.headers['x-tempmail-meta'];
    if (!metaBase64) {
      return res.status(400).json({ success: false, message: 'Missing X-TempMail-Meta header' });
    }

    let meta;
    try {
      meta = JSON.parse(Buffer.from(metaBase64, 'base64').toString('utf8'));
    } catch (e) {
      return res.status(400).json({ success: false, message: 'Invalid metadata' });
    }

    const { recipients, sender: senderAddress } = meta;

    if (!recipients || recipients.length === 0) {
      return res.status(400).json({ success: false, message: 'No recipients' });
    }

    // ── req.body is already the raw Buffer (from express.raw middleware) ──────
    const rawEmail = req.body;
    if (!rawEmail || rawEmail.length === 0) {
      return res.status(400).json({ success: false, message: 'Empty email body' });
    }

    // ── Parse MIME email ─────────────────────────────────────────────────────
    const parsed = await simpleParser(rawEmail);

    const subject = parsed.subject || '(No Subject)';
    const bodyText = parsed.text || '';
    const dirtyHtml = parsed.html || parsed.textAsHtml || `<pre>${bodyText}</pre>`;
    const bodyHtml = cleanHtml(dirtyHtml);
    const messageId = parsed.messageId || `<${uuidv4()}@tempmail>`;
    const rawHeaders = JSON.stringify(parsed.headerLines || []);

    // ── Spam scoring ─────────────────────────────────────────────────────────
    const { score: spamScore, isSpam } = calculateSpamScore(subject, bodyText, senderAddress);

    // ── Process each recipient ───────────────────────────────────────────────
    for (const recipientAddress of recipients) {
      const normalizedAddress = recipientAddress.toLowerCase().trim();
      const domainPart = normalizedAddress.split('@')[1];

      // In production, enforce domain check; dev accepts all
      if (process.env.NODE_ENV === 'production') {
        const knownDomain = await Domain.findOne({ name: domainPart, isActive: true });
        if (!knownDomain) {
          console.warn(`[SMTP Controller] Rejected: unmanaged domain ${domainPart}`);
          continue;
        }
      }

      // Auto-create inbox if not exists
      const inbox = await getOrCreateInbox(normalizedAddress);
      const expiresAt = inbox.expiresAt;

      // ── Process attachments ────────────────────────────────────────────────
      const attachmentMeta = [];
      const attachmentSaves = [];

      if (parsed.attachments && parsed.attachments.length > 0) {
        for (const att of parsed.attachments) {
          const attachmentId = uuidv4();
          attachmentMeta.push({
            filename: att.filename || `file_${attachmentId.slice(0, 8)}`,
            contentType: att.contentType || 'application/octet-stream',
            size: att.size || att.content.length,
            contentId: att.cid || null,
            attachmentId,
          });
          if (att.contentDisposition !== 'inline') {
            attachmentSaves.push({
              attachmentId,
              filename: att.filename || 'attachment',
              contentType: att.contentType || 'application/octet-stream',
              size: att.size || att.content.length,
              content: att.content,
            });
          }
        }
      }

      // ── Save email to MongoDB ──────────────────────────────────────────────
      const newEmail = await Email.create({
        inboxAddress: normalizedAddress,
        sender: {
          address: senderAddress,
          name: parsed.from?.value?.[0]?.name || senderAddress,
        },
        recipients: [{ address: normalizedAddress, name: '' }],
        subject,
        bodyText,
        bodyHtml,
        rawHeaders,
        attachments: attachmentMeta,
        messageId,
        size: rawEmail.length,
        isRead: false,
        isSpam,
        spamScore,
        expiresAt,
      });

      // ── Save attachments ───────────────────────────────────────────────────
      if (attachmentSaves.length > 0) {
        const docs = attachmentSaves.map((a) => ({ ...a, emailId: newEmail._id }));
        await Attachment.insertMany(docs);
      }

      // ── Update inbox counters ──────────────────────────────────────────────
      await Inbox.updateOne(
        { address: normalizedAddress },
        { $inc: { unreadCount: 1, totalReceived: 1 } }
      );

      // ── Emit to Socket.io room INSTANTLY ──────────────────────────────────
      emitNewEmail(normalizedAddress, {
        _id: newEmail._id,
        inboxAddress: normalizedAddress,
        sender: newEmail.sender,
        subject: newEmail.subject,
        snippet: bodyText.slice(0, 150),
        attachmentsCount: attachmentMeta.filter((a) => !a.contentId).length,
        isRead: false,
        isSpam,
        createdAt: newEmail.createdAt,
      });

      console.log(`[SMTP] ✅ Saved & pushed: ${normalizedAddress} | "${subject}" | Spam:${isSpam}`);
    }

    return res.status(200).json({ success: true, message: 'Email processed successfully' });
  } catch (err) {
    console.error('[SMTP Controller] Error:', err.message);
    next(err);
  }
};
