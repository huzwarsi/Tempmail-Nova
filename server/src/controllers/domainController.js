const Domain = require('../models/Domain');

exports.getPublicDomains = async (req, res, next) => {
  try {
    const defaultName = (process.env.DEFAULT_DOMAIN || 'tempmailnova.com').toLowerCase();

    // Deactivate local/test domains if any exist in DB
    await Domain.updateMany({ name: { $in: ['tempmail.local', 'disposable.local', 'tmpbox.dev'] } }, { isActive: false, isDefault: false });

    // Ensure production domain is active in DB
    let prodDomain = await Domain.findOne({ name: defaultName });
    if (!prodDomain) {
      prodDomain = await Domain.create({ name: defaultName, isDefault: true, isActive: true });
    } else if (!prodDomain.isActive || !prodDomain.isDefault) {
      await Domain.updateOne({ name: defaultName }, { isDefault: true, isActive: true });
    }

    let domains = await Domain.find({ isActive: true }).select('name isDefault isPremium usageCount');
    
    if (domains.length === 0) {
      domains = [{ name: defaultName, isDefault: true, isPremium: false, usageCount: 0 }];
    }

    res.json({
      success: true,
      count: domains.length,
      domains,
    });
  } catch (error) {
    next(error);
  }
};

exports.addDomain = async (req, res, next) => {
  try {
    const { name, isDefault, isPremium } = req.body;

    const existing = await Domain.findOne({ name: name.toLowerCase() });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Domain already exists' });
    }

    if (isDefault) {
      await Domain.updateMany({}, { isDefault: false });
    }

    const domain = await Domain.create({
      name: name.toLowerCase(),
      isDefault: isDefault || false,
      isPremium: isPremium || false,
    });

    res.status(201).json({
      success: true,
      domain,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteDomain = async (req, res, next) => {
  try {
    const { id } = req.params;

    await Domain.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Domain deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
