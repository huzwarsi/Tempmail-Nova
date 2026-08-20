const User = require('../models/User');
const ApiKey = require('../models/ApiKey');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'super_secret_tempmail_jwt_key_2026_change_in_production', {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User with this email already exists' });
    }

    const user = await User.create({ name, email, password });
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        plan: user.plan,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        plan: user.plan,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const apiKeys = await ApiKey.find({ user: user._id });

    res.json({
      success: true,
      user,
      apiKeys,
    });
  } catch (error) {
    next(error);
  }
};

exports.createApiKey = async (req, res, next) => {
  try {
    const { name } = req.body;
    const rawKey = 'tm_' + crypto.randomBytes(24).toString('hex');
    const prefix = rawKey.slice(0, 8);

    const apiKey = await ApiKey.create({
      user: req.user._id,
      name: name || 'Default API Key',
      key: rawKey,
      prefix,
    });

    res.status(201).json({
      success: true,
      apiKey: {
        id: apiKey._id,
        name: apiKey.name,
        key: apiKey.key, // Only returned once!
        createdAt: apiKey.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};
