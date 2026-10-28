const mongoose = require('mongoose');

// Helper to calculate clinical/heuristic sleep score (0-100)
function calculateSleepScore({ durationMinutes, targetHours = 8, sleepLatencyMinutes = 15, awakeningsCount = 0, qualityRating = 7 }) {
  // 1. Duration score (40 points max)
  const targetMin = targetHours * 60;
  const durationRatio = Math.min(durationMinutes / targetMin, 1.1);
  const durationScore = Math.max(0, 40 - Math.abs(1 - durationRatio) * 40);

  // 2. Latency score (20 points max): optimal is 10-20 min. >45 min penalizes heavily
  let latencyScore = 20;
  if (sleepLatencyMinutes > 20) {
    latencyScore = Math.max(5, 20 - (sleepLatencyMinutes - 20) * 0.5);
  } else if (sleepLatencyMinutes < 5) {
    // Falling asleep instantly often indicates severe sleep deprivation
    latencyScore = 15;
  }

  // 3. Disturbances / Awakenings score (20 points max)
  const awakeningsScore = Math.max(0, 20 - awakeningsCount * 5);

  // 4. Perceived Quality rating (20 points max, qualityRating is 1-10)
  const qualityScore = (qualityRating / 10) * 20;

  const total = Math.round(durationScore + latencyScore + awakeningsScore + qualityScore);
  return Math.min(100, Math.max(10, total));
}

const sleepLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    date: {
      type: Date,
      default: Date.now,
      index: true,
    },
    bedtime: {
      type: String, // e.g. "23:15"
      required: [true, 'Bedtime is required'],
    },
    wakeTime: {
      type: String, // e.g. "07:30"
      required: [true, 'Wake time is required'],
    },
    durationMinutes: {
      type: Number,
      required: true,
      min: 60,
      max: 1200,
    },
    sleepLatencyMinutes: {
      type: Number,
      default: 15,
      min: 0,
      max: 240,
    },
    qualityRating: {
      type: Number,
      required: true,
      min: 1,
      max: 10,
    },
    awakeningsCount: {
      type: Number,
      default: 0,
      min: 0,
      max: 20,
    },
    deepSleepEstimatePercent: {
      type: Number,
      default: 20,
      min: 0,
      max: 60,
    },
    morningMood: {
      type: String,
      enum: ['Refreshed', 'Alert', 'Neutral', 'Groggy', 'Exhausted'],
      default: 'Alert',
    },
    caffeineCups: {
      type: Number,
      default: 1,
      min: 0,
      max: 15,
    },
    screenTimeBeforeBedMin: {
      type: Number,
      default: 20,
      min: 0,
      max: 240,
    },
    exerciseMinutes: {
      type: Number,
      default: 0,
      min: 0,
      max: 300,
    },
    notes: {
      type: String,
      maxlength: 500,
      trim: true,
    },
    sleepScore: {
      type: Number,
      min: 0,
      max: 100,
    },
  },
  {
    timestamps: true,
  }
);

// Auto-calculate sleepScore before save
sleepLogSchema.pre('save', function () {
  if (!this.sleepScore) {
    this.sleepScore = calculateSleepScore({
      durationMinutes: this.durationMinutes,
      sleepLatencyMinutes: this.sleepLatencyMinutes,
      awakeningsCount: this.awakeningsCount,
      qualityRating: this.qualityRating,
    });
  }
});

// Composite index for fast query of user's logs sorted by date
sleepLogSchema.index({ userId: 1, date: -1 });

module.exports = mongoose.model('SleepLog', sleepLogSchema);
module.exports.calculateSleepScore = calculateSleepScore;
