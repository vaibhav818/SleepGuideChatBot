const SleepLog = require('../models/SleepLog');
const mockStore = require('../config/mockStore');
const { getDBStatus } = require('../config/db');

// @desc    Get weekly trends for visualization
// @route   GET /api/analytics/trends
// @access  Private
exports.getWeeklyTrends = async (req, res, next) => {
  try {
    const days = parseInt(req.query.days, 10) || 7;
    const dbStatus = getDBStatus();

    let logs = [];
    if (dbStatus.connected) {
      logs = await SleepLog.find({ userId: req.user._id })
        .sort({ date: 1 })
        .limit(days)
        .lean();
    } else {
      await mockStore.init();
      logs = mockStore.sleepLogs
        .filter((l) => l.userId.toString() === req.user._id.toString())
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(-days);
    }

    const trends = logs.map((l) => {
      const d = new Date(l.date);
      return {
        date: d.toISOString().split('T')[0],
        dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
        durationHours: parseFloat((l.durationMinutes / 60).toFixed(1)),
        sleepScore: l.sleepScore || 75,
        sleepLatency: l.sleepLatencyMinutes || 15,
        qualityRating: l.qualityRating,
        awakenings: l.awakeningsCount || 0,
        caffeineCups: l.caffeineCups || 0,
        deepSleepPercent: l.deepSleepEstimatePercent || 20,
      };
    });

    res.status(200).json({
      success: true,
      count: trends.length,
      data: trends,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get clinical sleep audit and sleep debt report
// @route   GET /api/analytics/audit
// @access  Private
exports.getSleepAudit = async (req, res, next) => {
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

    const targetHours = req.user?.sleepProfile?.targetHours || 8;
    const chronotype = req.user?.sleepProfile?.chronotype || 'Intermediate';

    if (logs.length === 0) {
      return res.status(200).json({
        success: true,
        audit: {
          status: 'Insufficient Data',
          message: 'Log at least 3 sleep sessions to generate your clinical sleep audit.',
          sleepDebtHours: 0,
          regularityScore: 100,
        },
      });
    }

    const avgDurationHours = (
      logs.reduce((acc, l) => acc + l.durationMinutes, 0) /
      (logs.length * 60)
    ).toFixed(1);

    const avgScore = Math.round(
      logs.reduce((acc, l) => acc + (l.sleepScore || 70), 0) / logs.length
    );

    const avgLatency = Math.round(
      logs.reduce((acc, l) => acc + (l.sleepLatencyMinutes || 15), 0) / logs.length
    );

    // Sleep Debt Calculation (last 7 logs)
    const recent7 = logs.slice(0, 7);
    const target7 = recent7.length * targetHours;
    const actual7 = recent7.reduce((acc, l) => acc + l.durationMinutes / 60, 0);
    const sleepDebt = parseFloat(Math.max(0, target7 - actual7).toFixed(1));

    // Bedtime consistency / Sleep Regularity Index (SRI) heuristic
    const bedMinutes = logs.map((l) => {
      const [h, m] = (l.bedtime || '23:00').split(':').map(Number);
      return (h < 12 ? h + 24 : h) * 60 + m;
    });
    const avgBedMin = bedMinutes.reduce((a, b) => a + b, 0) / bedMinutes.length;
    const bedVariance =
      bedMinutes.reduce((a, b) => a + Math.pow(b - avgBedMin, 2), 0) / bedMinutes.length;
    const bedStdDevMinutes = Math.round(Math.sqrt(bedVariance));

    // SRI (0-100) where < 30 min variation = 95+ score
    const regularityScore = Math.max(40, Math.min(100, Math.round(100 - bedStdDevMinutes * 0.8)));

    // Categorization
    let grade = 'A';
    if (avgScore < 70) grade = 'C';
    else if (avgScore < 85) grade = 'B';

    let recommendations = [];
    if (sleepDebt > 3) {
      recommendations.push({
        title: 'High Sleep Debt Alert',
        detail: `You have accumulated ${sleepDebt} hours of sleep debt. Consider going to bed 45 minutes earlier tonight instead of oversleeping on the weekend.`,
        priority: 'High',
      });
    }
    if (avgLatency > 25) {
      recommendations.push({
        title: 'Elevated Sleep Latency',
        detail: `Your average time to fall asleep is ${avgLatency} minutes. Power down digital screens 45 minutes earlier and lower ambient bedroom temperature to 18-19°C.`,
        priority: 'Medium',
      });
    }
    if (bedStdDevMinutes > 45) {
      recommendations.push({
        title: 'Circadian Desynchronization',
        detail: `Your bedtime fluctuates by ±${bedStdDevMinutes} minutes. Anchoring your wake-up time will strengthen your master circadian clock.`,
        priority: 'High',
      });
    }
    if (recommendations.length === 0) {
      recommendations.push({
        title: 'Optimal Sleep Architecture',
        detail: 'Your sleep timing, latency, and duration are closely aligned with clinical guidelines. Keep up the consistent evening wind-down routine!',
        priority: 'Low',
      });
    }

    res.status(200).json({
      success: true,
      audit: {
        grade,
        avgScore,
        avgDurationHours,
        avgLatency,
        sleepDebtHours: sleepDebt,
        regularityScore,
        chronotype,
        bedStdDevMinutes,
        recommendations,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Calculate optimal 90-minute sleep cycles
// @route   POST /api/analytics/sleep-cycle
// @access  Public
exports.calculateSleepCycles = (req, res) => {
  const { targetWakeTime, targetBedTime, latencyMin = 15 } = req.body;

  // If user provides target wake time, calculate bedtime options
  if (targetWakeTime) {
    const [wH, wM] = targetWakeTime.split(':').map(Number);
    const wakeDate = new Date();
    wakeDate.setHours(wH, wM, 0, 0);

    const cycles = [6, 5, 4, 3].map((cycleCount) => {
      const sleepMin = cycleCount * 90;
      const totalMin = sleepMin + latencyMin;
      const bedDate = new Date(wakeDate.getTime() - totalMin * 60000);
      const hoursStr = String(bedDate.getHours()).padStart(2, '0');
      const minStr = String(bedDate.getMinutes()).padStart(2, '0');

      return {
        cycles: cycleCount,
        durationHours: (sleepMin / 60).toFixed(1),
        suggestedBedtime: `${hoursStr}:${minStr}`,
        recommended: cycleCount === 5, // 7.5 hours is optimal for most adults
        description: cycleCount === 5 ? 'Optimal (5 cycles - 7.5h sleep)' : `${cycleCount} cycles (${(sleepMin / 60)}h sleep)`,
      };
    });

    return res.status(200).json({
      success: true,
      targetWakeTime,
      options: cycles,
    });
  }

  // If user provides bedtime, calculate optimal wake times
  if (targetBedTime) {
    const [bH, bM] = targetBedTime.split(':').map(Number);
    const bedDate = new Date();
    bedDate.setHours(bH, bM, 0, 0);

    const cycles = [3, 4, 5, 6].map((cycleCount) => {
      const sleepMin = cycleCount * 90;
      const totalMin = sleepMin + latencyMin;
      const wakeDate = new Date(bedDate.getTime() + totalMin * 60000);
      const hoursStr = String(wakeDate.getHours()).padStart(2, '0');
      const minStr = String(wakeDate.getMinutes()).padStart(2, '0');

      return {
        cycles: cycleCount,
        durationHours: (sleepMin / 60).toFixed(1),
        suggestedWakeTime: `${hoursStr}:${minStr}`,
        recommended: cycleCount === 5,
        description: cycleCount === 5 ? 'Optimal (5 cycles - 7.5h sleep)' : `${cycleCount} cycles (${(sleepMin / 60)}h sleep)`,
      };
    });

    return res.status(200).json({
      success: true,
      targetBedTime,
      options: cycles,
    });
  }

  return res.status(400).json({
    success: false,
    message: 'Please provide either targetWakeTime or targetBedTime',
  });
};

