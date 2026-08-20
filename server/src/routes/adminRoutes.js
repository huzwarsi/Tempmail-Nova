const express = require('express');
const router = express.Router();
const {
  getAdminDashboardStats,
  getUsersList,
  getSettings,
  updateSetting,
  getSystemLogs,
} = require('../controllers/adminController');
const { protect } = require('../middleware/auth');
const { adminOnly } = require('../middleware/admin');

router.use(protect, adminOnly);

router.get('/dashboard', getAdminDashboardStats);
router.get('/users', getUsersList);
router.get('/settings', getSettings);
router.post('/settings', updateSetting);
router.get('/logs', getSystemLogs);

module.exports = router;
