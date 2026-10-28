const express = require('express');
const router = express.Router();
const {
  getWeeklyTrends,
  getSleepAudit,
  calculateSleepCycles,
} = require('../controllers/analyticsController');
const { protect } = require('../middleware/auth');

// Public route for sleep cycle calculator tool
router.post('/sleep-cycle', calculateSleepCycles);

// Protected routes for personal analytics
router.get('/trends', protect, getWeeklyTrends);
router.get('/audit', protect, getSleepAudit);

module.exports = router;

