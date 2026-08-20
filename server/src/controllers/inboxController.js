const Inbox = require('../models/Inbox');
const Domain = require('../models/Domain');
const Email = require('../models/Email');
const Attachment = require('../models/Attachment');
const { v4: uuidv4 } = require('uuid');

/**
 * Helper to fetch a valid active domain name from DB or env
 */
const getActiveDomainName = async () => {
  const defaultDomain = await Domain.findOne({ isActive: true, isDefault: true });
  if (defaultDomain) return defaultDomain.name;
  
  const anyDomain = await Domain.findOne({ isActive: true });
  if (anyDomain) return anyDomain.name;

  return process.env.DEFAULT_DOMAIN || 'tempmail.local';
};

exports.generateRandomInbox = async (req, res, next) => {
  try {
    const domain = await getActiveDomainName();
    const username = 'tmp_' + Math.random().toString(36).substring(2, 10);
    const address = `${username}@${domain}`.toLowerCase();

    const expirationHours = parseInt(process.env.MAX_INBOX_EXPIRATION_HOURS || '24', 10);
    const expiresAt = new Date(Date.now() + expirationHours * 60 * 60 * 1000);

    const pin = Math.floor(1000 + Math.random() * 9000).toString(); // Generate 4-digit PIN

    const inbox = await Inbox.create({
      address,
      username,
      domain,
      user: req.user ? req.user._id : null,
      fingerprint: req.body.fingerprint || null,
      pin,
      expiresAt,
    });

    res.status(201).json({
      success: true,
      inbox,
    });
  } catch (error) {
    next(error);
  }
};

exports.createCustomInbox = async (req, res, next) => {
  try {
    const { customUsername, requestedDomain } = req.body;

    if (!customUsername || customUsername.length < 3) {
      return res.status(400).json({ success: false, message: 'Username must be at least 3 characters long' });
    }

    const cleanUsername = customUsername.toLowerCase().replace(/[^a-z0-9._-]/g, '');
    const domain = requestedDomain || (await getActiveDomainName());
    const address = `${cleanUsername}@${domain}`.toLowerCase();

    const existing = await Inbox.findOne({ address });
    if (existing) {
      return res.status(400).json({ success: false, message: 'This email address is currently active or taken. Try another.' });
    }

    const expirationHours = parseInt(process.env.MAX_INBOX_EXPIRATION_HOURS || '24', 10);
    const expiresAt = new Date(Date.now() + expirationHours * 60 * 60 * 1000);

    const pin = Math.floor(1000 + Math.random() * 9000).toString(); // Generate 4-digit PIN

    const inbox = await Inbox.create({
      address,
      username: cleanUsername,
      domain,
      user: req.user ? req.user._id : null,
      fingerprint: req.body.fingerprint || null,
      pin,
      isCustom: true,
      expiresAt,
    });

    res.status(201).json({
      success: true,
      inbox,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteInbox = async (req, res, next) => {
  try {
    const { address } = req.params;
    const normalized = address.toLowerCase().trim();

    const emails = await Email.find({ inboxAddress: normalized });
    const emailIds = emails.map((e) => e._id);

    await Attachment.deleteMany({ emailId: { $in: emailIds } });
    await Email.deleteMany({ inboxAddress: normalized });
    await Inbox.deleteOne({ address: normalized });

    res.json({
      success: true,
      message: `Inbox ${normalized} and all associated emails purged successfully.`,
    });
  } catch (error) {
    next(error);
  }
};

exports.toggleFavoriteInbox = async (req, res, next) => {
  try {
    const { address } = req.params;
    const normalized = address.toLowerCase().trim();

    const inbox = await Inbox.findOne({ address: normalized });
    if (!inbox) {
      return res.status(404).json({ success: false, message: 'Inbox not found' });
    }

    inbox.isFavorite = !inbox.isFavorite;
    await inbox.save();

    res.json({
      success: true,
      inbox,
    });
  } catch (error) {
    next(error);
  }
};

exports.getInboxDetails = async (req, res, next) => {
  try {
    const { address } = req.params;
    const normalized = address.toLowerCase().trim();

    let inbox = await Inbox.findOne({ address: normalized });
    if (!inbox) {
      // Auto-create inbox if receiving for a valid domain
      const parts = normalized.split('@');
      if (parts.length === 2) {
        const expirationHours = parseInt(process.env.MAX_INBOX_EXPIRATION_HOURS || '24', 10);
        const pin = Math.floor(1000 + Math.random() * 9000).toString(); // Generate 4-digit PIN
        inbox = await Inbox.create({
          address: normalized,
          username: parts[0],
          domain: parts[1],
          pin,
          expiresAt: new Date(Date.now() + expirationHours * 60 * 60 * 1000),
        });
      } else {
        return res.status(404).json({ success: false, message: 'Invalid inbox address format' });
      }
    }

    res.json({
      success: true,
      inbox,
    });
  } catch (error) {
    next(error);
  }
};
