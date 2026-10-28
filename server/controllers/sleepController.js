const SleepLog = require('../models/SleepLog');
const { calculateSleepScore } = require('../models/SleepLog');
const mockStore = require('../config/mockStore');
const { getDBStatus } = require('../config/db');

// Helper to calculate duration from bedtime and wakeTime strings if duration not supplied
function parseDuration(bedtime, wakeTime) {
  const [bH, bM] = bedtime.split(':').map(Number);
  const [wH, wM] = wakeTime.split(':').map(Number);
  
  let bedTotal = bH * 60 + bM;
  let wakeTotal = wH * 60 + wM;
  
  if (wakeTotal <= bedTotal) {
    // Overnight sleep past midnight
    wakeTotal += 24 * 60;
  }
  return wakeTotal - bedTotal;
}

// @desc    Log a new sleep entry
// @route   POST /api/sleep
// @access  Private
exports.logSleep = async (req, res, next) => {
  try {
    const {
      date,
      bedtime,
      wakeTime,
      sleepLatencyMinutes = 15,
      qualityRating = 7,
      awakeningsCount = 0,
      deepSleepEstimatePercent = 20,
      morningMood = 'Alert',
      caffeineCups = 1,
      screenTimeBeforeBedMin = 30,
      exerciseMinutes = 0,
      notes = '',
    } = req.body;

    let durationMinutes = req.body.durationMinutes;
    if (!durationMinutes && bedtime && wakeTime) {
      durationMinutes = parseDuration(bedtime, wakeTime);
    }

    const targetHours = req.user?.sleepProfile?.targetHours || 8;
    const calculatedScore = calculateSleepScore({
      durationMinutes,
      targetHours,
      sleepLatencyMinutes,
      awakeningsCount,
      qualityRating,
    });

    const dbStatus = getDBStatus();

    if (dbStatus.connected) {
      const log = await SleepLog.create({
        userId: req.user._id,
        date: date ? new Date(date) : new Date(),
        bedtime,
        wakeTime,
        durationMinutes,
        sleepLatencyMinutes,
        qualityRating,
        awakeningsCount,
        deepSleepEstimatePercent,
        morningMood,
        caffeineCups,
        screenTimeBeforeBedMin,
        exerciseMinutes,
        notes,
        sleepScore: calculatedScore,
      });

      return res.status(201).json({
        success: true,
        message: 'Sleep session logged successfully',
        data: log,
      });
    } else {
      // In-memory fallback
      await mockStore.init();
      const log = {
        _id: 'mock_log_' + Date.now(),
        userId: req.user._id,
        date: date ? new Date(date) : new Date(),
        bedtime,
        wakeTime,
        durationMinutes,
        sleepLatencyMinutes,
        qualityRating,
        awakeningsCount,
        deepSleepEstimatePercent,
        morningMood,
        caffeineCups,
        screenTimeBeforeBedMin,
        exerciseMinutes,
        notes,
        sleepScore: calculatedScore,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockStore.sleepLogs.unshift(log);

      return res.status(201).json({
        success: true,
        message: 'Sleep session logged successfully (in-memory mode)',
        data: log,
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get all sleep logs for current user
// @route   GET /api/sleep
// @access  Private
exports.getSleepLogs = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 30;
    const page = parseInt(req.query.page, 10) || 1;
    const skip = (page - 1) * limit;

    const dbStatus = getDBStatus();

    if (dbStatus.connected) {
      const logs = await SleepLog.find({ userId: req.user._id })
        .sort({ date: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

      const total = await SleepLog.countDocuments({ userId: req.user._id });

      return res.status(200).json({
        success: true,
        count: logs.length,
        total,
        page,
        pages: Math.ceil(total / limit),
        data: logs,
      });
    } else {
      await mockStore.init();
      const userLogs = mockStore.sleepLogs
        .filter((l) => l.userId.toString() === req.user._id.toString())
        .sort((a, b) => new Date(b.date) - new Date(a.date));

      const paginated = userLogs.slice(skip, skip + limit);

      return res.status(200).json({
        success: true,
        count: paginated.length,
        total: userLogs.length,
        page,
        pages: Math.ceil(userLogs.length / limit) || 1,
        data: paginated,
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get aggregated sleep statistics
// @route   GET /api/sleep/stats
// @access  Private
exports.getSleepStats = async (req, res, next) => {
  try {
    const dbStatus = getDBStatus();
    let logs = [];

    if (dbStatus.connected) {
      logs = await SleepLog.find({ userId: req.user._id })
        .sort({ date: -1 })
        .limit(14)
        .lean();
    } else {
      await mockStore.init();
      logs = mockStore.sleepLogs
        .filter((l) => l.userId.toString() === req.user._id.toString())
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 14);
    }

    if (logs.length === 0) {
      return res.status(200).json({
        success: true,
        data: {
          hasLogs: false,
          avgScore: 0,
          avgDurationHours: 0,
          avgLatency: 0,
          avgAwakenings: 0,
          sleepEfficiency: 0,
          totalLogged: 0,
          streakDays: 0,
          targetHours: req.user?.sleepProfile?.targetHours || 8,
          sleepDebtHours: 0,
        },
      });
    }

    const targetHours = req.user?.sleepProfile?.targetHours || 8;
    const totalScore = logs.reduce((acc, l) => acc + (l.sleepScore || 70), 0);
    const totalDurationMin = logs.reduce((acc, l) => acc + l.durationMinutes, 0);
    const totalLatency = logs.reduce((acc, l) => acc + (l.sleepLatencyMinutes || 15), 0);
    const totalAwakenings = logs.reduce((acc, l) => acc + (l.awakeningsCount || 0), 0);

    const avgScore = Math.round(totalScore / logs.length);
    const avgDurationHours = parseFloat((totalDurationMin / (logs.length * 60)).toFixed(1));
    const avgLatency = Math.round(totalLatency / logs.length);
    const avgAwakenings = parseFloat((totalAwakenings / logs.length).toFixed(1));

    // Sleep Efficiency = (actual sleep time / total time in bed) * 100
    // Heuristic: total time in bed = duration + latency + awakenings * 10 min
    const estimatedBedTimeMin = totalDurationMin + totalLatency + totalAwakenings * 10;
    const sleepEfficiency = Math.min(98, Math.max(50, Math.round((totalDurationMin / (estimatedBedTimeMin || totalDurationMin)) * 100)));

    // Sleep debt over last 7 days (or available logs up to 7)
    const recent7 = logs.slice(0, 7);
    const expectedHours7 = recent7.length * targetHours;
    const actualHours7 = recent7.reduce((acc, l) => acc + l.durationMinutes / 60, 0);
    const sleepDebtHours = parseFloat(Math.max(0, expectedHours7 - actualHours7).toFixed(1));

    return res.status(200).json({
      success: true,
      data: {
        hasLogs: true,
        avgScore,
        avgDurationHours,
        avgLatency,
        avgAwakenings,
        sleepEfficiency,
        totalLogged: logs.length,
        streakDays: logs.length,
        targetHours,
        sleepDebtHours,
        latestLog: logs[0],
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a sleep log
// @route   DELETE /api/sleep/:id
// @access  Private
exports.deleteSleepLog = async (req, res, next) => {
  try {
    const { id } = req.params;
    const dbStatus = getDBStatus();

    if (dbStatus.connected) {
      const log = await SleepLog.findOne({ _id: id, userId: req.user._id });
      if (!log) {
        return res.status(404).json({ success: false, message: 'Log not found' });
      }
      await log.deleteOne();
      return res.status(200).json({ success: true, message: 'Sleep log deleted' });
    } else {
      await mockStore.init();
      const index = mockStore.sleepLogs.findIndex(
        (l) => l._id.toString() === id && l.userId.toString() === req.user._id.toString()
      );
      if (index === -1) {
        return res.status(404).json({ success: false, message: 'Log not found' });
      }
      mockStore.sleepLogs.splice(index, 1);
      return res.status(200).json({ success: true, message: 'Sleep log deleted' });
    }
  } catch (error) {
    next(error);
  }
};

