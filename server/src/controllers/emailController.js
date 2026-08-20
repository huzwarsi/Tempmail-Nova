const Email = require('../models/Email');
const Attachment = require('../models/Attachment');
const Inbox = require('../models/Inbox');

exports.getEmailsForInbox = async (req, res, next) => {
  try {
    const { address } = req.params;
    const { search, page = 1, limit = 20 } = req.query;
    const normalized = address.toLowerCase().trim();

    const query = { inboxAddress: normalized };

    if (search) {
      query.$or = [
        { subject: { $regex: search, $options: 'i' } },
        { 'sender.name': { $regex: search, $options: 'i' } },
        { 'sender.address': { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);

    const [emails, total] = await Promise.all([
      Email.find(query)
        .select('_id inboxAddress sender subject bodyText attachments isRead isSpam createdAt')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit, 10)),
      Email.countDocuments(query),
    ]);

    // Format list preview
    const formattedEmails = emails.map((e) => ({
      _id: e._id,
      inboxAddress: e.inboxAddress,
      sender: e.sender,
      subject: e.subject,
      snippet: e.bodyText.slice(0, 120) + (e.bodyText.length > 120 ? '...' : ''),
      attachmentsCount: e.attachments.length,
      isRead: e.isRead,
      isSpam: e.isSpam,
      createdAt: e.createdAt,
    }));

    res.json({
      success: true,
      count: formattedEmails.length,
      total,
      page: parseInt(page, 10),
      pages: Math.ceil(total / limit),
      emails: formattedEmails,
    });
  } catch (error) {
    next(error);
  }
};

exports.getEmailById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const email = await Email.findById(id);
    if (!email) {
      return res.status(404).json({ success: false, message: 'Email message not found' });
    }

    // Mark as read and decrement unread counter in inbox
    if (!email.isRead) {
      email.isRead = true;
      await email.save();

      await Inbox.updateOne(
        { address: email.inboxAddress, unreadCount: { $gt: 0 } },
        { $inc: { unreadCount: -1 } }
      );
    }

    res.json({
      success: true,
      email,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteEmail = async (req, res, next) => {
  try {
    const { id } = req.params;

    const email = await Email.findById(id);
    if (!email) {
      return res.status(404).json({ success: false, message: 'Email message not found' });
    }

    await Attachment.deleteMany({ emailId: email._id });
    await Email.deleteOne({ _id: email._id });

    res.json({
      success: true,
      message: 'Email and its attachments deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

exports.downloadAttachment = async (req, res, next) => {
  try {
    const { attachmentId } = req.params;

    const attachment = await Attachment.findOne({ attachmentId });
    if (!attachment) {
      return res.status(404).json({ success: false, message: 'Attachment file not found' });
    }

    res.setHeader('Content-Type', attachment.contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(attachment.filename)}"`);
    res.setHeader('Content-Length', attachment.size);

    return res.send(attachment.content);
  } catch (error) {
    next(error);
  }
};

exports.getRawEmailSource = async (req, res, next) => {
  try {
    const { id } = req.params;

    const email = await Email.findById(id);
    if (!email) {
      return res.status(404).json({ success: false, message: 'Email not found' });
    }

    res.json({
      success: true,
      messageId: email.messageId,
      headers: email.rawHeaders,
      bodyText: email.bodyText,
      bodyHtml: email.bodyHtml,
    });
  } catch (error) {
    next(error);
  }
};
