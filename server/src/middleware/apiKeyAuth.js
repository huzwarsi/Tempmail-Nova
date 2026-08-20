const ApiKey = require('../models/ApiKey');

const validateApiKey = async (req, res, next) => {
  const keyHeader = req.headers['x-api-key'] || req.query.api_key;

  if (!keyHeader) {
    return res.status(401).json({ success: false, message: 'API Key missing. Pass X-API-Key header or api_key query param.' });
  }

  try {
    const apiKeyDoc = await ApiKey.findOne({ key: keyHeader, isActive: true });
    if (!apiKeyDoc) {
      return res.status(401).json({ success: false, message: 'Invalid or revoked API Key.' });
    }

    // Increment usage metrics asynchronously
    apiKeyDoc.usageCount += 1;
    apiKeyDoc.lastUsedAt = new Date();
    apiKeyDoc.save().catch((err) => console.warn('[ApiKey Metrics Error]:', err.message));

    req.apiKey = apiKeyDoc;
    next();
  } catch (error) {
    return res.status(500).json({ success: false, message: 'API Key authentication failed.' });
  }
};

module.exports = { validateApiKey };
