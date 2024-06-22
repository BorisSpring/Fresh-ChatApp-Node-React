const catchAsyncStomp = require('../utils/catchAsyncStomp');

// utils
const { getUserIdFromSocketHeader } = require('../stomp/stompUtils');

// models
const Chat = require('../models/chatModel');
const Message = require('../models/messageModel');
const GroupChat = require('../models/groupChatModel');

const loggedUsers = require('../stomp/loggedUsers');

onHandleOpenChat = catchAsyncStomp(async (eventDetails, socket, io) => {
  const reqUserId = await getUserIdFromSocketHeader(socket);
  const { id, isGroup } = eventDetails;

  const chat = isGroup
    ? await GroupChat.findOne({ _id: id, participants: reqUserId })
    : await Chat.findOne({ _id: id, participants: reqUserId });

  if (!chat) throw new AppError('No chat found !', 404);

  chat.unreadedMessages.forEach((userInfo) => {
    if (userInfo.userId.equals(reqUserId)) {
      userInfo.count = 0;
    }
  });

  await chat.save();

  await Message.updateMany(
    {
      chatId: id,
      senderId: { $ne: reqUserId },
      'seenBy.userId': { $ne: reqUserId },
    },
    {
      $push: {
        seenBy: {
          userId: reqUserId,
          seenAt: new Date(),
        },
      },
    }
  );

  chat.participants.forEach((participant) => {
    if (!participant.equals(reqUserId)) {
      let loggedUserDetails = loggedUsers.loggedUsers?.[participant.toString()];
      if (loggedUserDetails) {
        io.to(loggedUserDetails.socketId).emit('seenChatMessages', {
          userId: reqUserId,
          chatId: id,
          isGroup: isGroup,
        });
      }
    }
  });
});

module.exports = onHandleOpenChat;
