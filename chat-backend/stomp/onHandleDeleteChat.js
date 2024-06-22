// socket util
const { getUserIdFromSocketHeader } = require('../stomp/stompUtils');

// utils
const catchAsyncStomp = require('../utils/catchAsyncStomp');
const AppError = require('../utils/appError');

// models
const Chat = require('../models/chatModel');
const Message = require('../models/messageModel');

updateSingleChat = async (chatId, reqUserId) => {
  const updatedChat = await Chat.findOneAndUpdate(
    {
      _id: chatId,
      participants: reqUserId,
      visibleFor: reqUserId,
      isGroup: false,
    },
    { $pull: { visibleFor: reqUserId } },
    { new: true }
  );
  if (!updatedChat) throw new AppError('Fail to delete chat!', 400);
};

makeChatMessageNotVisibleForRequestUser = async (chatId, reqUserId) => {
  await Message.updateMany(
    { chatId: chatId, visibleFor: reqUserId },
    { $pull: { visibleFor: reqUserId } }
  );
};

onHandleDeleteChat = catchAsyncStomp(async (eventDetails, socket, io) => {
  const { chatId } = eventDetails;
  if (!chatId) throw new AppError('Chat id is missing!', 400);

  const reqUserId = await getUserIdFromSocketHeader(socket);

  await updateSingleChat(chatId, reqUserId);
  await makeChatMessageNotVisibleForRequestUser(chatId, reqUserId);

  io.to(socket.id).emit('chatDeleted', { chatId: chatId });
});

module.exports = onHandleDeleteChat;
