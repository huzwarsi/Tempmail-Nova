const express = require('express');
const router = express.Router();
const {
  getEmailsForInbox,
  getEmailById,
  deleteEmail,
  downloadAttachment,
  getRawEmailSource,
} = require('../controllers/emailController');

router.get('/inbox/:address', getEmailsForInbox);
router.get('/message/:id', getEmailById);
router.delete('/message/:id', deleteEmail);
router.get('/attachment/:attachmentId', downloadAttachment);
router.get('/raw/:id', getRawEmailSource);

module.exports = router;
