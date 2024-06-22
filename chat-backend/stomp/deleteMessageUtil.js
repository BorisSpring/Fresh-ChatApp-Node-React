const fs = require('fs');
// model
const Message = require('../models/messageModel');

// utils
const AppError = require('../utils/appError');

// peforming delete message based on type if it is for all or only for the user that request deleting depends on prop isDeleteForAll
const deleteMessage = async (messageId, reqUserId, isDeleteForAll) => {
  const message = await Message.findById(messageId);

  if (!message) {
    throw new AppError('Message not found', 404);
  }

  if (isDeleteForAll && !message.senderId.equals(reqUserId)) {
    throw new AppError(
      'You are not authorized to delete this message for all',
      403
    );
  }

  if (message.isDeleted && isDeleteForAll) {
    throw new AppError('Message is already deleted for all', 400);
  }

  if (isDeleteForAll) {
    message.isDeleted = true;
    message.oldTextMessage = message?.message;
    message.fileUrl = undefined;
    message.imageUrl = undefined;
    message.message = 'Message has been deleted';
  } else {
    message.visibleFor = message.visibleFor.filter(
      (userId) => !userId.equals(reqUserId)
    );
  }

  return await message.save({ validateBeforeSave: false });
};

module.exports = deleteMessage;
