// cathc util
const catchAsyncStomp = require('../utils/catchAsyncStomp');
const AppError = require('../utils/appError');

// stomp util
const { getUserFromSocketHeader } = require('../stomp/stompUtils');

const { loggedUsers } = require('../stomp/loggedUsers');

// mongoose model
const GroupChat = require('../models/groupChatModel');
const Message = require('../models/messageModel');

onHandleLeaveGroupChat = catchAsyncStomp(async (eventDetails, socket, io) => {
  const { chatId } = eventDetails;
  const reqUser = await getUserFromSocketHeader(socket);

  const reqUserId = reqUser._id;

  const groupChat = await GroupChat.findOne({
    _id: chatId,
    participants: reqUserId,
    visibleFor: reqUserId,
  });

  if (groupChat.createdBy.equals(reqUserId)) {
    throw new AppError('Cannot leave your own group chat!', 400);
  }

  // fields to filter leaved user id from
  const arraysToUpdate = ['participants', 'visibleFor', 'admins'];

  arraysToUpdate.forEach((arrayField) => {
    groupChat[arrayField] = groupChat[arrayField].filter(
      (item) => !item.equals(reqUserId)
    );
  });

  const newMessage = await Message.create({
    senderId: reqUser._id,
    chatId: chatId,
    message: `${reqUser.name} ${reqUser.lastName} has leaved the group chat!`,
    visibleFor: groupChat.participants,
    imageUrl: undefined,
    fileUrl: undefined,
  });

  groupChat.unreadedMessages.forEach((userUndreadedMessage) => {
    if (!userUndreadedMessage.userId.equals(reqUser._id)) {
      userUndreadedMessage.count += 1;
    }
  });

  groupChat.save();

  io.to(socket.id).emit('leavedGroupChat', { chatId: chatId });

  const { isSeen, isDeleted, fileUrl, imageUrl, message, createdAt, _id } =
    newMessage;

  const updatedMessage = {
    isSeen,
    isDeleted,
    fileUrl,
    imageUrl,
    message,
    createdAt,
    id: _id,
    senderId: {
      _id: reqUser._id,
      name: reqUser.name,
      lastName: reqUser.lastName,
      image: reqUser.image,
    },
  };

  groupChat.participants.forEach((participantId) => {
    const participantDetails = loggedUsers[participantId];
    if (participantDetails) {
      io.to(participantDetails.socketId).emit('newMessage', {
        chatId: chatId,
        message: updatedMessage,
        isGroup: true,
      });
    }
  });
});

module.exports = onHandleLeaveGroupChat;
