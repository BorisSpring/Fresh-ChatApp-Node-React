// utils
const catchAsyncStomp = require('../utils/catchAsyncStomp');
const AppError = require('../utils/appError');

// socket utils
const { getUserIdFromSocketHeader } = require('../stomp/stompUtils');

// currently logged user on server
const { loggedUsers } = require('../stomp/loggedUsers');

// models
const User = require('../models/userModel');
const GroupChat = require('../models/groupChatModel');

onHandleCreateGroupChat = catchAsyncStomp(async (eventDetails, socket, io) => {
  const { participants, chatName } = eventDetails;

  const users = await User.find({ _id: { $in: participants } });

  if (users?.length !== participants?.length) {
    throw new AppError('Invalid participant!');
  }

  const reqUserId = await getUserIdFromSocketHeader(socket);

  participants.push(reqUserId);

  let groupChat = await GroupChat.create({
    participants: participants,
    unreadedMessages: participants.map((participant) => ({
      userId: participant,
      count: 0,
    })),
    createdBy: reqUserId,
    visibleFor: participants,
    admins: [reqUserId],
    chatName: chatName,
  });

  if (!groupChat) throw new AppError('Fail to create group chat', 400);

  groupChat = await GroupChat.findById(groupChat._id).populate({
    path: 'participants',
    select: 'name lastName image',
  });

  participants.forEach((participant) => {
    const loggedUser = loggedUsers[participant];
    if (loggedUser) {
      io.to(loggedUser.socketId).emit('newGroupChat', {
        chatName: chatName,
        _id: groupChat._doc._id,
        unreadedMessages: 0,
        visibleFor: undefined,
        participants: groupChat._doc.participants,
        admins: groupChat._doc.admins,
        createdBy: reqUserId,
      });
    }
  });
});

module.exports = onHandleCreateGroupChat;
