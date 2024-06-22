const express = require('express');

const { downloadFileFromMessage } = require('../controllers/messageController');
const { protect } = require('../controllers/authController');

const messageRouter = express.Router();

messageRouter.get('/:messageId', protect, downloadFileFromMessage);

module.exports = messageRouter;
