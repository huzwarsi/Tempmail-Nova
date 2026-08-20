const express = require('express');
const router = express.Router();
const {
  generateRandomInbox,
  createCustomInbox,
  deleteInbox,
  toggleFavoriteInbox,
  getInboxDetails,
} = require('../controllers/inboxController');
const { strictLimiter } = require('../middleware/rateLimiter');

router.post('/random', generateRandomInbox);
router.post('/custom', strictLimiter, createCustomInbox);
router.get('/:address', getInboxDetails);
router.delete('/:address', deleteInbox);
router.put('/:address/favorite', toggleFavoriteInbox);

module.exports = router;
