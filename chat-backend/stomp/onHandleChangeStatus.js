// dodait posle jwt kao pretragu a ne dirkento userid u eventu theader ovde
const mongoose = require('mongoose');

const catchAsyncStomp = require('../utils/catchAsyncStomp');

// chat model
const Chat = require('../models/chatModel');

// currently logged user on server
const { loggedUsers } = require('./loggedUsers');

// finding logged user chats
findUserChats = async (userId) => {
  return await Chat.find({
    participants: userId,
    visibleFor: userId,
  }).select('participants');
};

// filter useritself from participants in his chats
filterUserItselfFromChatParticipants = async (userIdToFilter, chats) => {
  const idToFilter = new mongoose.Types.ObjectId(userIdToFilter);

  return chats.map((chat) =>
    chat.participants.filter((participant) => !participant.equals(idToFilter))
  );
};

// finding socket for logged users and emiting status change events
findLoggedUserSocketsAndEmitStatusChangeToAll = async (
  participantsIds,
  requestUserId,
  status,
  io
) => {
  const uniqueSocketsIds = new Set(
    participantsIds
      .flat()
      .map(
        (loggedUserChatsParticipant) =>
          loggedUsers[loggedUserChatsParticipant]?.socketId
      )
  );

  uniqueSocketsIds.forEach((socketId) => {
    io.to(socketId).emit('userStatus', {
      userId: requestUserId,
      status: status,
    });
  });
};

// handle change status (active,busy,offline)
onHandleChangeStatus = catchAsyncStomp(async (eventDetails, socket, io) => {
  const { userId, status } = eventDetails;

  if (eventDetails.status === 'offline') {
    delete loggedUsers[userId];
  } else {
    loggedUsers[userId] = {
      socketId: socket.id,
      status: status,
    };
  }

  const loggedUserChats = await findUserChats(userId);

  const participantsIds = await filterUserItselfFromChatParticipants(
    userId,
    loggedUserChats
  );

  await findLoggedUserSocketsAndEmitStatusChangeToAll(
    participantsIds,
    userId,
    status,
    io
  );
});

module.exports = onHandleChangeStatus;
