// socket util
const { getUserFromSocketHeader } = require('../stomp/stompUtils');

// utils
const catchAsyncStomp = require('../utils/catchAsyncStomp');
const AppError = require('../utils/appError');

// logged users
const { loggedUsers } = require('../stomp/loggedUsers');

// model
const GroupChat = require('../models/groupChatModel');

onHandleDeleteGroupChat = catchAsyncStomp(async (eventDetails, socket, io) => {
  const { chatId } = eventDetails;

  const [reqUser, groupChat] = await Promise.all([
    getUserFromSocketHeader(socket),
    GroupChat.findById(chatId),
  ]);

  if (!groupChat) throw new AppError('No group chat found', 404);

  if (!groupChat.createdBy.equals(reqUser._id))
    throw new AppError(
      'You dont have permission to delete this group chat',
      403
    );

  await GroupChat.findByIdAndDelete(chatId);

  groupChat.participants.forEach((participant) => {
    const loggedUserDetails = loggedUsers[participant.toString()];
    if (loggedUserDetails) {
      io.to(loggedUserDetails.socketId).emit('groupChatDeleted', {
        chatId: chatId,
      });
    }
  });
});

module.exports = onHandleDeleteGroupChat;
