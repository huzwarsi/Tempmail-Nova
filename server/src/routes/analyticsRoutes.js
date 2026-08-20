const express = require('express');
const router = express.Router();
const { getPublicStats } = require('../controllers/analyticsController');

router.get('/public', getPublicStats);

module.exports = router;
