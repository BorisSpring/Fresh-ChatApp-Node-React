// models
const GroupChat = require('../models/groupChatModel');
const Message = require('../models/messageModel');

// utils
const AppError = require('../utils/appError');
const { getUserFromSocketHeader } = require('../stomp/stompUtils');

// currently logged users on server
const { loggedUsers } = require('./loggedUsers');

infromUserAboutNewMessage = async (
  newMessage,
  chatId,
  participantId,
  io,
  reqUser
) => {
  const participantDetails = loggedUsers[participantId];

  if (!participantDetails) return;

  const {
    isSeen,
    isDeleted,
    fileUrl,
    imageUrl,
    message,
    createdAt,
    _id,
    seenBy,
  } = newMessage;

  const updatedMessage = {
    seenBy,
    isSeen,
    isDeleted,
    fileUrl,
    imageUrl,
    message,
    createdAt,
    id: _id,
    senderId: participantId.equals(reqUser._id)
      ? null
      : {
          _id: reqUser._id,
          name: reqUser.name,
          lastName: reqUser.lastName,
          image: reqUser.image,
        },
  };
  io.to(participantDetails.socketId).emit('newMessage', {
    chatId: chatId,
    message: updatedMessage,
    isGroup: true,
  });
};

exports.informUsersAboutNewMessageInGroupChat = async (
  message,
  isTextMessage,
  isImageMessage,
  isFileMessage,
  chatId,
  socket,
  io
) => {
  try {
    const reqUser = await getUserFromSocketHeader(socket);
    const groupChat = await GroupChat.findOne({
      participants: reqUser._id,
      visibleFor: reqUser._id,
      _id: chatId,
    });

    if (!groupChat)
      throw new AppError('There is no group chat with this id!', 400);

    const newMessage = await Message.create({
      senderId: reqUser._id,
      chatId: chatId,
      message: isTextMessage ? message : undefined,
      visibleFor: groupChat.participants,
      imageUrl: isImageMessage ? message : undefined,
      fileUrl: isFileMessage ? message : undefined,
    });

    if (!newMessage) throw new AppError('Fail to send message!', 400);

    groupChat.unreadedMessages.forEach((userUndreadedMessage) => {
      if (!userUndreadedMessage.userId.equals(reqUser._id)) {
        userUndreadedMessage.count += 1;
      }
    });

    await Promise.all([
      groupChat.save(),
      groupChat.visibleFor.map((participantId) =>
        infromUserAboutNewMessage(
          newMessage,
          chatId,
          participantId,
          io,
          reqUser
        )
      ),
    ]);
  } catch (err) {
    io.to(socket.id).emit(
      'error',
      err.isOperational ? err.message : 'Ops something went wrong!'
    );
  }
};
