// In-memory data store fallback for demoing/testing without local MongoDB installed.
const bcrypt = require('bcryptjs');

const mockStore = {
  users: [],
  sleepLogs: [],
  conversations: [],
  initialized: false,

  async init() {
    if (this.initialized) return;

    // Seed a standard demo user
    const salt = await bcrypt.genSalt(10);
    const demoHashedPassword = await bcrypt.hash('sleep123', salt);
    
    const demoUser = {
      _id: '675d00000000000000000001',
      name: 'Alex Mercer (Demo)',
      email: 'demo@sleepguide.ai',
      password: demoHashedPassword,
      sleepProfile: {
        targetHours: 8,
        chronotype: 'Intermediate',
        bedtimePreference: '23:30',
        wakePreference: '07:30',
        caffeineCutoffHour: 14,
        stressLevel: 'Moderate',
        primaryGoal: 'Fall asleep faster and reduce night awakenings',
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.push(demoUser);

    // Seed 7 days of realistic sleep logs
    const sampleDates = [
      { daysAgo: 6, bedtime: '23:45', wakeTime: '07:15', duration: 450, lat: 25, qual: 7, awk: 1, mood: 'Alert', caffeine: 2, score: 78 },
      { daysAgo: 5, bedtime: '00:15', wakeTime: '06:45', duration: 390, lat: 35, qual: 6, awk: 2, mood: 'Groggy', caffeine: 3, score: 65 },
      { daysAgo: 4, bedtime: '23:30', wakeTime: '07:30', duration: 480, lat: 15, qual: 8, awk: 0, mood: 'Refreshed', caffeine: 1, score: 88 },
      { daysAgo: 3, bedtime: '01:00', wakeTime: '07:00', duration: 360, lat: 40, qual: 5, awk: 3, mood: 'Exhausted', caffeine: 4, score: 54 },
      { daysAgo: 2, bedtime: '23:15', wakeTime: '07:45', duration: 510, lat: 12, qual: 9, awk: 0, mood: 'Refreshed', caffeine: 1, score: 94 },
      { daysAgo: 1, bedtime: '23:50', wakeTime: '07:20', duration: 450, lat: 20, qual: 8, awk: 1, mood: 'Alert', caffeine: 2, score: 82 },
      { daysAgo: 0, bedtime: '23:30', wakeTime: '07:30', duration: 480, lat: 14, qual: 9, awk: 0, mood: 'Refreshed', caffeine: 1, score: 92 },
    ];

    sampleDates.forEach((s, idx) => {
      const d = new Date();
      d.setDate(d.getDate() - s.daysAgo);
      this.sleepLogs.push({
        _id: `675d0000000000000000001${idx}`,
        userId: demoUser._id,
        date: d,
        bedtime: s.bedtime,
        wakeTime: s.wakeTime,
        durationMinutes: s.duration,
        sleepLatencyMinutes: s.lat,
        qualityRating: s.qual,
        awakeningsCount: s.awk,
        deepSleepEstimatePercent: 20 + (s.qual * 1.5),
        morningMood: s.mood,
        caffeineCups: s.caffeine,
        screenTimeBeforeBedMin: s.lat > 25 ? 45 : 15,
        exerciseMinutes: s.score > 80 ? 45 : 0,
        notes: s.score > 80 ? 'Felt great, read a book before bed.' : 'High screen time and late espresso.',
        sleepScore: s.score,
        createdAt: d,
        updatedAt: d,
      });
    });

    // Seed a welcome conversation
    this.conversations.push({
      _id: '675d00000000000000000099',
      userId: demoUser._id,
      title: 'Sleep Hygiene & Latency Optimization',
      messages: [
        {
          _id: 'm1',
          sender: 'user',
          text: 'Hi SomnaAI! I keep taking over 30 minutes to fall asleep on days I drink afternoon coffee. Any advice?',
          timestamp: new Date(Date.now() - 3600000 * 24),
        },
        {
          _id: 'm2',
          sender: 'assistant',
          text: `Hello Alex! Based on your sleep logs, on days you consume 3+ cups of caffeine, your sleep latency averages **35-40 minutes** (compared to 12-15 minutes on low-caffeine days). 

### Key Clinical Insights:
1. **Adenosine Blockade**: Caffeine has a biological half-life of 5 to 7 hours. Even if you fall asleep, residual caffeine fragments slow-wave delta sleep.
2. **Caffeine Curfew**: Strictly adhere to your 2:00 PM caffeine cutoff.
3. **The 4-7-8 Breathing Technique**: If latency exceeds 20 minutes, get out of bed in dim light to reset sleep pressure rather than tossing and turning.`,
          timestamp: new Date(Date.now() - 3600000 * 23.9),
          actionableTips: [
            'Cut off caffeine 9-10 hours prior to bedtime (target 2:00 PM)',
            'Leave bed after 20 minutes of wakefulness to prevent conditioning sleep anxiety',
            'Try 5 minutes of 4-7-8 parasympathetic breathing'
          ]
        }
      ],
      contextUsed: {
        avgScore: 79,
        avgDurationHours: 7.4,
        logsCount: 7,
        chronotype: 'Intermediate',
      },
      createdAt: new Date(Date.now() - 3600000 * 24),
      updatedAt: new Date(Date.now() - 3600000 * 23.9),
    });

    this.initialized = true;
  }
};

module.exports = mockStore;

