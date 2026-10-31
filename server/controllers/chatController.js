const ChatConversation = require('../models/ChatConversation');
const SleepLog = require('../models/SleepLog');
const { generateSleepAdvice } = require('../services/geminiService');
const mockStore = require('../config/mockStore');
const { getDBStatus } = require('../config/db');

// @desc    Send a message to Gemini Sleep Guidance Chatbot
// @route   POST /api/chat/message
// @access  Private
exports.sendMessage = async (req, res, next) => {
  try {
    const { message, conversationId } = req.body;
    const dbStatus = getDBStatus();

    let sleepLogs = [];
    if (dbStatus.connected) {
      sleepLogs = await SleepLog.find({ userId: req.user._id })
        .sort({ date: -1 })
        .limit(7)
        .lean();
    } else {
      await mockStore.init();
      sleepLogs = mockStore.sleepLogs
        .filter((l) => l.userId.toString() === req.user._id.toString())
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 7);
    }

    let conversation;
    let history = [];

    if (dbStatus.connected) {
      if (conversationId) {
        conversation = await ChatConversation.findOne({
          _id: conversationId,
          userId: req.user._id,
        });
      }

      if (!conversation) {
        // Create new conversation thread
        conversation = new ChatConversation({
          userId: req.user._id,
          title: message.slice(0, 45) + (message.length > 45 ? '...' : ''),
          messages: [],
        });
      }

      history = conversation.messages;
    } else {
      // In-memory mode
      await mockStore.init();
      if (conversationId) {
        conversation = mockStore.conversations.find(
          (c) => c._id.toString() === conversationId && c.userId.toString() === req.user._id.toString()
        );
      }

      if (!conversation) {
        conversation = {
          _id: 'mock_conv_' + Date.now(),
          userId: req.user._id,
          title: message.slice(0, 45) + (message.length > 45 ? '...' : ''),
          messages: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        mockStore.conversations.unshift(conversation);
      }

      history = conversation.messages;
    }

    // Call Gemini Sleep Guidance Service
    const aiResponse = await generateSleepAdvice({
      user: req.user,
      sleepLogs,
      message,
      conversationHistory: history,
    });

    const userMessageObj = {
      sender: 'user',
      text: message,
      timestamp: new Date(),
    };

    const assistantMessageObj = {
      sender: 'assistant',
      text: aiResponse.text,
      actionableTips: aiResponse.actionableTips || [],
      timestamp: new Date(),
    };

    if (dbStatus.connected) {
      conversation.messages.push(userMessageObj);
      conversation.messages.push(assistantMessageObj);
      conversation.updatedAt = new Date();
      await conversation.save();

      return res.status(200).json({
        success: true,
        conversationId: conversation._id,
        message: assistantMessageObj.text,
        response: assistantMessageObj.text,
        messageObj: assistantMessageObj,
        source: aiResponse.source,
      });
    } else {
      conversation.messages.push(userMessageObj);
      conversation.messages.push(assistantMessageObj);
      conversation.updatedAt = new Date();

      return res.status(200).json({
        success: true,
        conversationId: conversation._id,
        message: assistantMessageObj.text,
        response: assistantMessageObj.text,
        messageObj: assistantMessageObj,
        source: aiResponse.source,
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get all conversations for user
// @route   GET /api/chat/conversations
// @access  Private
exports.getConversations = async (req, res, next) => {
  try {
    const dbStatus = getDBStatus();

    if (dbStatus.connected) {
      const conversations = await ChatConversation.find({ userId: req.user._id })
        .select('title summary createdAt updatedAt messages')
        .sort({ updatedAt: -1 })
        .lean();

      const formatted = conversations.map((c) => ({
        id: c._id,
        title: c.title,
        messageCount: c.messages?.length || 0,
        lastMessage: c.messages?.slice(-1)[0]?.text?.slice(0, 80) || 'No messages',
        updatedAt: c.updatedAt,
      }));

      return res.status(200).json({
        success: true,
        data: formatted,
      });
    } else {
      await mockStore.init();
      const userConvs = mockStore.conversations
        .filter((c) => c.userId.toString() === req.user._id.toString())
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

      const formatted = userConvs.map((c) => ({
        id: c._id,
        title: c.title,
        messageCount: c.messages?.length || 0,
        lastMessage: c.messages?.slice(-1)[0]?.text?.slice(0, 80) || 'No messages',
        updatedAt: c.updatedAt,
      }));

      return res.status(200).json({
        success: true,
        data: formatted,
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get single conversation with full message thread
// @route   GET /api/chat/conversations/:id
// @access  Private
exports.getConversationById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const dbStatus = getDBStatus();

    let conversation;
    if (dbStatus.connected) {
      conversation = await ChatConversation.findOne({
        _id: id,
        userId: req.user._id,
      }).lean();
    } else {
      await mockStore.init();
      conversation = mockStore.conversations.find(
        (c) => c._id.toString() === id && c.userId.toString() === req.user._id.toString()
      );
    }

    if (!conversation) {
      return res.status(404).json({ success: false, message: 'Conversation not found' });
    }

    // Format messages so both sender/text and role/content are guaranteed
    const formattedMessages = (conversation.messages || []).map((m) => {
      const isUser = m.sender === 'user' || m.role === 'user';
      const textVal = m.text || m.content || '';
      return {
        ...m,
        sender: isUser ? 'user' : 'assistant',
        role: isUser ? 'user' : 'assistant',
        text: textVal,
        content: textVal,
      };
    });

    return res.status(200).json({
      success: true,
      data: {
        ...conversation,
        messages: formattedMessages,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete conversation thread
// @route   DELETE /api/chat/conversations/:id
// @access  Private
exports.deleteConversation = async (req, res, next) => {
  try {
    const { id } = req.params;
    const dbStatus = getDBStatus();

    if (dbStatus.connected) {
      const conv = await ChatConversation.findOne({ _id: id, userId: req.user._id });
      if (!conv) {
        return res.status(404).json({ success: false, message: 'Conversation not found' });
      }
      await conv.deleteOne();
      return res.status(200).json({ success: true, message: 'Conversation deleted' });
    } else {
      await mockStore.init();
      const idx = mockStore.conversations.findIndex(
        (c) => c._id.toString() === id && c.userId.toString() === req.user._id.toString()
      );
      if (idx === -1) {
        return res.status(404).json({ success: false, message: 'Conversation not found' });
      }
      mockStore.conversations.splice(idx, 1);
      return res.status(200).json({ success: true, message: 'Conversation deleted' });
    }
  } catch (error) {
    next(error);
  }
};

