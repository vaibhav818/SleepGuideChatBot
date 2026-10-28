const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
      trim: true,
      maxlength: [50, 'Name cannot be more than 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    sleepProfile: {
      targetHours: {
        type: Number,
        default: 8,
        min: 4,
        max: 12,
      },
      chronotype: {
        type: String,
        enum: ['Morning Lark', 'Night Owl', 'Intermediate', 'Hummingbird'],
        default: 'Intermediate',
      },
      bedtimePreference: {
        type: String,
        default: '23:00',
      },
      wakePreference: {
        type: String,
        default: '07:00',
      },
      caffeineCutoffHour: {
        type: Number,
        default: 14, // 2 PM
        min: 8,
        max: 22,
      },
      stressLevel: {
        type: String,
        enum: ['Low', 'Moderate', 'High'],
        default: 'Moderate',
      },
      primaryGoal: {
        type: String,
        default: 'Fall asleep faster and achieve deeper sleep',
      },
    },
  },
  {
    timestamps: true,
  }
);

// Encrypt password using bcrypt before saving
userSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
