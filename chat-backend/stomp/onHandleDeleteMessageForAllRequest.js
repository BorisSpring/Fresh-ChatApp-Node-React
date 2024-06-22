// stomp utils
const deleteMessage = require('./deleteMessageUtil');
const { getUserIdFromSocketHeader } = require('./stompUtils');

// utils
const catchAsyncStomp = require('../utils/catchAsyncStomp');
const AppError = require('../utils/appError');

const { loggedUsers } = require('../stomp/loggedUsers');

// model
const Chat = require('../models/chatModel');
const GroupChat = require('../models/groupChatModel');

// handlign delete message for all users in the chat
onHandleDeleteMessageForAll = catchAsyncStomp(
  async (eventDetails, socket, io) => {
    const { messageId, isGroup } = eventDetails;

    // if (messageId) throw new AppError('Missing message id!', 400);

    const requestUserId = await getUserIdFromSocketHeader(socket);

    const deletedMessage = await deleteMessage(messageId, requestUserId, true);

    let chat = isGroup
      ? await GroupChat.findById(deletedMessage.chatId)
      : await Chat.findById(deletedMessage.chatId);

    if (!chat) throw new AppError('Chat doesnt exists');

    const socketIdsForLoggedUserToSendEvent = chat.visibleFor
      .map((userId) => loggedUsers[userId]?.socketId)
      .filter(Boolean);

    socketIdsForLoggedUserToSendEvent.forEach((socketId) =>
      io.to(socketId).emit('deleteMessageForAllResponse', {
        messageId: messageId,
        chatId: deletedMessage.chatId,
        isGroup: isGroup,
      })
    );
  }
);

module.exports = onHandleDeleteMessageForAll;
