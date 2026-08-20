/**
 * SMTP Internal Route
 *
 * This route is ONLY called by Haraka plugin (tempmail_deliver.js).
 * It MUST NOT be exposed to the public internet — protected by internal secret header.
 *
 * Use Nginx to block /smtp/* from public access:
 *   location /smtp/ { deny all; }
 */

const express = require('express');
const router = express.Router();
const { receiveIncoming } = require('../controllers/smtpController');

// Raw body middleware — needed to receive raw MIME email from Haraka
router.post(
  '/incoming',
  express.raw({ type: 'message/rfc822', limit: '26mb' }),
  receiveIncoming
);

module.exports = router;
