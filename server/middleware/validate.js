const { body, validationResult } = require('express-validator');

// Validation error handler middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((err) => err.msg).filter(Boolean);
    return res.status(400).json({
      success: false,
      message: errorMessages.length > 0 ? errorMessages.join(', ') : 'Validation failed',
      errors: errors.array().map((err) => ({
        field: err.path || err.param,
        message: err.msg,
      })),
    });
  }
  next();
};

// Validation rules
const registerValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  handleValidationErrors,
];

const loginValidation = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
  handleValidationErrors,
];

const sleepLogValidation = [
  body('bedtime')
    .notEmpty()
    .withMessage('Bedtime is required (e.g. 23:00)'),
  body('wakeTime')
    .notEmpty()
    .withMessage('Wake time is required (e.g. 07:00)'),
  body('durationMinutes')
    .optional()
    .isNumeric()
    .withMessage('Duration in minutes must be a number')
    .isInt({ min: 60, max: 1200 })
    .withMessage('Duration must be between 60 minutes and 1200 minutes (1-20 hours)'),
  body('qualityRating')
    .isInt({ min: 1, max: 10 })
    .withMessage('Quality rating must be an integer between 1 and 10'),
  body('sleepLatencyMinutes')
    .optional()
    .isInt({ min: 0, max: 240 })
    .withMessage('Sleep latency must be between 0 and 240 minutes'),
  body('awakeningsCount')
    .optional()
    .isInt({ min: 0, max: 20 })
    .withMessage('Awakenings count must be between 0 and 20'),
  handleValidationErrors,
];

const chatMessageValidation = [
  body('message')
    .trim()
    .notEmpty()
    .withMessage('Message text cannot be empty')
    .isLength({ max: 2000 })
    .withMessage('Message cannot exceed 2000 characters'),
  body('conversationId')
    .optional({ nullable: true, checkFalsy: true })
    .isString()
    .withMessage('conversationId must be a valid string'),
  handleValidationErrors,
];

module.exports = {
  registerValidation,
  loginValidation,
  sleepLogValidation,
  chatMessageValidation,
};
