const express = require('express');
const router = express.Router();
const { getPublicDomains, addDomain, deleteDomain } = require('../controllers/domainController');
const { protect } = require('../middleware/auth');
const { adminOnly } = require('../middleware/admin');

router.get('/public', getPublicDomains);
router.post('/add', protect, adminOnly, addDomain);
router.delete('/:id', protect, adminOnly, deleteDomain);

module.exports = router;
