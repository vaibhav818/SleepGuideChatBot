const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const mockStore = require('../config/mockStore');
const { getDBStatus } = require('../config/db');

// Helper to sign JWT token
const sendTokenResponse = (user, statusCode, res) => {
  const token = jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET || 'somna_sleep_super_secret_jwt_key_2025_interview_ready',
    { expiresIn: process.env.JWT_EXPIRE || '30d' }
  );

  res.status(statusCode).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      sleepProfile: user.sleepProfile,
    },
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, sleepProfile } = req.body;
    const dbStatus = getDBStatus();

    if (dbStatus.connected) {
      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).json({
          success: false,
          message: 'An account with this email already exists.',
        });
      }

      const user = await User.create({
        name,
        email,
        password,
        sleepProfile: sleepProfile || {},
      });

      return sendTokenResponse(user, 201, res);
    } else {
      // In-memory mode fallback
      await mockStore.init();
      const existing = mockStore.users.find((u) => u.email === email);
      if (existing) {
        return res.status(400).json({
          success: false,
          message: 'An account with this email already exists.',
        });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const newUser = {
        _id: 'mock_user_' + Date.now(),
        name,
        email,
        password: hashedPassword,
        sleepProfile: sleepProfile || {
          targetHours: 8,
          chronotype: 'Intermediate',
          bedtimePreference: '23:00',
          wakePreference: '07:00',
          caffeineCutoffHour: 14,
          stressLevel: 'Moderate',
          primaryGoal: 'Improve overall sleep quality and energy',
        },
        createdAt: new Date(),
      };
      mockStore.users.push(newUser);
      return sendTokenResponse(newUser, 201, res);
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const dbStatus = getDBStatus();

    let user;
    if (dbStatus.connected) {
      // Special handler for demo credentials to guarantee seamless login
      if (email === 'demo@sleepguide.ai' && password === 'sleep123') {
        return exports.demoLogin(req, res, next);
      }

      user = await User.findOne({ email }).select('+password');
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password',
        });
      }

      const isMatch = await user.matchPassword(password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password',
        });
      }

      return sendTokenResponse(user, 200, res);
    } else {
      // In-memory fallback
      await mockStore.init();
      if (email === 'demo@sleepguide.ai' && password === 'sleep123') {
        return sendTokenResponse(mockStore.users[0], 200, res);
      }
      user = mockStore.users.find((u) => u.email === email);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password',
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password',
        });
      }

      return sendTokenResponse(user, 200, res);
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Demo 1-Click Login (Preloaded with sample data for instant testing)
// @route   POST /api/auth/demo
// @access  Public
exports.demoLogin = async (req, res, next) => {
  try {
    await mockStore.init();
    const demoData = mockStore.users[0];
    const dbStatus = getDBStatus();

    if (dbStatus.connected) {
      // Find or create demo user in MongoDB
      let user = await User.findOne({ email: demoData.email });
      if (!user) {
        user = await User.create({
          name: demoData.name,
          email: demoData.email,
          password: 'sleep123',
          sleepProfile: demoData.sleepProfile,
        });

        // Seed 7 sample sleep logs for this user in MongoDB
        const SleepLog = require('../models/SleepLog');
        const sampleLogs = mockStore.sleepLogs.map((l) => ({
          userId: user._id,
          date: l.date,
          bedtime: l.bedtime,
          wakeTime: l.wakeTime,
          durationMinutes: l.durationMinutes,
          sleepLatencyMinutes: l.sleepLatencyMinutes,
          qualityRating: l.qualityRating,
          awakeningsCount: l.awakeningsCount,
          morningMood: l.morningMood,
          caffeineCups: l.caffeineCups,
          notes: l.notes,
          sleepScore: l.sleepScore,
        }));
        await SleepLog.insertMany(sampleLogs);
      }
      return sendTokenResponse(user, 200, res);
    } else {
      return sendTokenResponse(demoData, 200, res);
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        sleepProfile: req.user.sleepProfile,
        createdAt: req.user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile & sleep settings
// @route   PUT /api/auth/profile
// @access  Private
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, sleepProfile } = req.body;
    const dbStatus = getDBStatus();

    if (dbStatus.connected) {
      const user = await User.findById(req.user._id);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      if (name) user.name = name;
      if (sleepProfile) {
        user.sleepProfile = { ...user.sleepProfile.toObject(), ...sleepProfile };
      }

      await user.save();

      return res.status(200).json({
        success: true,
        message: 'Sleep profile updated successfully',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          sleepProfile: user.sleepProfile,
        },
      });
    } else {
      await mockStore.init();
      const user = mockStore.users.find(
        (u) => u._id.toString() === req.user._id.toString()
      );
      if (name) user.name = name;
      if (sleepProfile) {
        user.sleepProfile = { ...user.sleepProfile, ...sleepProfile };
      }

      return res.status(200).json({
        success: true,
        message: 'Sleep profile updated successfully (in-memory mode)',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          sleepProfile: user.sleepProfile,
        },
      });
    }
  } catch (error) {
    next(error);
  }
};
