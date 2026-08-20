const express = require('express');
const router = express.Router();
const {
  createInbox,
  getInboxMessages,
  getMessageById,
  deleteMessage,
} = require('../controllers/apiV1Controller');
const { validateApiKey } = require('../middleware/apiKeyAuth');

router.use(validateApiKey);

router.post('/inbox', createInbox);
router.get('/inbox/:address/messages', getInboxMessages);
router.get('/messages/:id', getMessageById);
router.delete('/messages/:id', deleteMessage);

module.exports = router;
