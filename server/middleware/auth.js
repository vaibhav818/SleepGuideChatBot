const jwt = require('jsonwebtoken');
const User = require('../models/User');
const mockStore = require('../config/mockStore');
const { getDBStatus } = require('../config/db');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Handle Demo Mode quick bypass if requested or token is 'demo-token'
  if (token === 'demo-token' || req.headers['x-demo-user'] === 'true') {
    await mockStore.init();
    req.user = mockStore.users[0];
    return next();
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route. No token provided.',
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'somna_sleep_super_secret_jwt_key_2025_interview_ready'
    );

    const dbStatus = getDBStatus();
    if (dbStatus.connected) {
      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) {
        // Fallback to mock store if user was created in mock
        await mockStore.init();
        req.user = mockStore.users.find((u) => u._id.toString() === decoded.id);
      }
    } else {
      await mockStore.init();
      req.user = mockStore.users.find(
        (u) => u._id.toString() === decoded.id || u.email === decoded.email
      );
    }

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'The user belonging to this token no longer exists.',
      });
    }

    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Token verification failed. Not authorized.',
      error: err.message,
    });
  }
};

module.exports = { protect };
