const User = require('../models/User');
const Inbox = require('../models/Inbox');
const Email = require('../models/Email');
const Domain = require('../models/Domain');
const Setting = require('../models/Setting');
const Log = require('../models/Log');

exports.getAdminDashboardStats = async (req, res, next) => {
  try {
    const [
      totalUsers,
      activeInboxes,
      totalEmails,
      totalDomains,
      spamCount,
    ] = await Promise.all([
      User.countDocuments(),
      Inbox.countDocuments(),
      Email.countDocuments(),
      Domain.countDocuments(),
      Email.countDocuments({ isSpam: true }),
    ]);

    const recentEmails = await Email.find()
      .select('inboxAddress sender subject isSpam createdAt')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      success: true,
      stats: {
        totalUsers,
        activeInboxes,
        totalEmails,
        totalDomains,
        spamCount,
        serverUptime: process.uptime(),
        memoryUsage: process.memoryUsage(),
      },
      recentEmails,
    });
  } catch (error) {
    next(error);
  }
};

exports.getUsersList = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({ success: true, count: users.length, users });
  } catch (error) {
    next(error);
  }
};

exports.getSettings = async (req, res, next) => {
  try {
    const settings = await Setting.find();
    res.json({ success: true, settings });
  } catch (error) {
    next(error);
  }
};

exports.updateSetting = async (req, res, next) => {
  try {
    const { key, value, category, description } = req.body;

    let setting = await Setting.findOne({ key });
    if (setting) {
      setting.value = value;
      if (category) setting.category = category;
      if (description) setting.description = description;
      await setting.save();
    } else {
      setting = await Setting.create({ key, value, category, description });
    }

    res.json({ success: true, setting });
  } catch (error) {
    next(error);
  }
};

exports.getSystemLogs = async (req, res, next) => {
  try {
    const logs = await Log.find().sort({ createdAt: -1 }).limit(100);
    res.json({ success: true, count: logs.length, logs });
  } catch (error) {
    next(error);
  }
};
