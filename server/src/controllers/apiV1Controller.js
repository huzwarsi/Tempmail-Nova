const Inbox = require('../models/Inbox');
const Email = require('../models/Email');
const Domain = require('../models/Domain');

/**
 * Public REST API for developers (guaranteed clean format for external integrations)
 */

const generateShortUsername = () => {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  const length = Math.floor(Math.random() * 2) + 5;
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

exports.createInbox = async (req, res, next) => {
  try {
    const { username, domain: reqDomain } = req.body;
    let selectedDomain = reqDomain;

    if (!selectedDomain) {
      const defaultDomainDoc = await Domain.findOne({ isActive: true, isDefault: true });
      selectedDomain = defaultDomainDoc ? defaultDomainDoc.name : (process.env.DEFAULT_DOMAIN || 'tempmailnova.com');
    }

    const cleanUser = username ? username.toLowerCase().replace(/[^a-z0-9._-]/g, '') : generateShortUsername();
    const address = `${cleanUser}@${selectedDomain}`.toLowerCase();

    const expirationHours = parseInt(process.env.MAX_INBOX_EXPIRATION_HOURS || '24', 10);
    const expiresAt = new Date(Date.now() + expirationHours * 60 * 60 * 1000);

    const inbox = await Inbox.create({
      address,
      username: cleanUser,
      domain: selectedDomain,
      user: req.apiKey.user,
      expiresAt,
    });

    res.status(201).json({
      status: 'success',
      data: {
        address: inbox.address,
        expiresAt: inbox.expiresAt,
        createdAt: inbox.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.getInboxMessages = async (req, res, next) => {
  try {
    const { address } = req.params;
    const normalized = address.toLowerCase().trim();

    const emails = await Email.find({ inboxAddress: normalized })
      .select('id inboxAddress sender subject bodyText attachments isRead createdAt')
      .sort({ createdAt: -1 });

    res.json({
      status: 'success',
      count: emails.length,
      data: emails,
    });
  } catch (error) {
    next(error);
  }
};

exports.getMessageById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const email = await Email.findById(id);
    if (!email) {
      return res.status(404).json({ status: 'error', message: 'Email not found' });
    }

    res.json({
      status: 'success',
      data: email,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteMessage = async (req, res, next) => {
  try {
    const { id } = req.params;

    const email = await Email.findByIdAndDelete(id);
    if (!email) {
      return res.status(404).json({ status: 'error', message: 'Email not found' });
    }

    res.json({
      status: 'success',
      message: 'Email deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
