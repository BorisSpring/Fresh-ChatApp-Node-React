const express = require('express');

const {
  findUserChats,
  findChatMessages,
  findUserGroupChats,
} = require('../controllers/chatController');
const { protect } = require('../controllers/authController');

const chatRouter = express.Router();

chatRouter.get('', protect, findUserChats);
chatRouter.route('/groupChats').get(protect, findUserGroupChats);

chatRouter.get('/:chatId', protect, findChatMessages);

module.exports = chatRouter;
