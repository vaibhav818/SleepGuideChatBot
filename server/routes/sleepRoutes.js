const express = require('express');
const router = express.Router();
const {
  logSleep,
  getSleepLogs,
  getSleepStats,
  deleteSleepLog,
} = require('../controllers/sleepController');
const { protect } = require('../middleware/auth');
const { sleepLogValidation } = require('../middleware/validate');

router.use(protect); // All sleep routes are protected

router.route('/')
  .post(sleepLogValidation, logSleep)
  .get(getSleepLogs);

router.get('/stats', getSleepStats);
router.delete('/:id', deleteSleepLog);

module.exports = router;

