const express = require('express');
const router = express.Router();
const {
  sendMessage,
  getConversations,
  getConversationById,
  deleteConversation,
} = require('../controllers/chatController');
const { protect } = require('../middleware/auth');
const { chatMessageValidation } = require('../middleware/validate');

router.use(protect); // All chat routes protected

router.post('/message', chatMessageValidation, sendMessage);
router.get('/conversations', getConversations);
router.get('/conversations/:id', getConversationById);
router.delete('/conversations/:id', deleteConversation);

module.exports = router;
