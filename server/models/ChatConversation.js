const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: {
    type: String,
    enum: ['user', 'assistant'],
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  actionableTips: [
    {
      type: String,
    },
  ],
});

const chatConversationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      default: 'New Sleep Consultation',
      trim: true,
    },
    messages: [messageSchema],
    summary: {
      type: String,
    },
    contextUsed: {
      avgScore: Number,
      avgDurationHours: Number,
      logsCount: Number,
      chronotype: String,
    },
  },
  {
    timestamps: true,
  }
);

chatConversationSchema.index({ userId: 1, updatedAt: -1 });

module.exports = mongoose.model('ChatConversation', chatConversationSchema);

