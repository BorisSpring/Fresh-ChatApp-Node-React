// stomp utils functions
const deleteMessage = require('./deleteMessageUtil');
const { getUserIdFromSocketHeader } = require('./stompUtils');

// catch utils to emit error messages to user
const AppError = require('../utils/appError');
const catchAsyncStomp = require('../utils/catchAsyncStomp');

// handlign deleting message
onHandleDeleteMessageMe = catchAsyncStomp(async (eventDetails, socket, io) => {
  const { messageId } = eventDetails;

  if (!messageId) throw new AppError('Missing message id!', 400);

  const requestUserId = await getUserIdFromSocketHeader(socket);

  const deletedMessage = await deleteMessage(messageId, requestUserId, false);

  io.to(socket.id).emit('deletedMessageForRequestUserResponse', {
    messageId: messageId,
    chatId: deletedMessage.chatId,
  });
});

module.exports = onHandleDeleteMessageMe;
