const express = require('express');
const router = express.Router();
const { register, login, getMe, createApiKey } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { strictLimiter } = require('../middleware/rateLimiter');

router.post('/register', strictLimiter, register);
router.post('/login', strictLimiter, login);
router.get('/me', protect, getMe);
router.post('/api-keys', protect, createApiKey);

module.exports = router;
