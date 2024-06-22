// models
const Chat = require('../models/chatModel');
const User = require('../models/userModel');
const Message = require('../models/messageModel');

// currently logged users on server
const { loggedUsers } = require('./loggedUsers');
const AppError = require('../utils/appError');

// utils
const { getUserFromSocketHeader } = require('../stomp/stompUtils');

// find request user and receiver user for chat when user send a message
findRequestUserAndReciverUser = async (receiverId, socket) => {
  if (!receiverId) {
    throw new AppError('All fields are required!', 400);
  }

  const [receiver, user] = await Promise.all([
    User.findById(receiverId),
    getUserFromSocketHeader(socket),
  ]);

  if (!user) {
    throw new AppError('Invalid token received!', 401);
  }

  if (!receiver)
    throw new AppError('Fail to send message, user doesnt exists!', 400);

  return { receiver, user };
};

checkForUsersChatIsExistsAndUserVisibility = async (participants) => {
  let chat = await Chat.findOne({ participants: { $all: participants } });

  if (!chat) {
    chat = await Chat.create({
      participants: participants,
      visibleFor: participants,
      createdBy: participants[0]._id,
      unreadedMessages: participants.map((participant) => ({
        userId: participant._id,
        count: participant._id.equals(participants[1]._id) ? 1 : 0,
      })),
    });
  } else {
    if (
      !chat.visibleFor.some((participantId) =>
        participantId.equals(participants[0]._id)
      )
    ) {
      chat.visibleFor.push(participants[0]._id);
    }
    if (
      !chat.visibleFor.some((participantId) =>
        participantId.equals(participants[1]._id)
      )
    ) {
      chat.visibleFor.push(participants[1]._id);
    }
    chat.unreadedMessages.forEach((userInfo) => {
      if (userInfo.userId.equals(participants[1]._id)) {
        userInfo.count += 1;
      }
    });
  }
  await chat.save();
  return chat;
};

sendMessageToReceiverAndRequestUser = async (
  reqUser,
  receiverUser,
  isForReqUser,
  socketId,
  chat,
  savedMessage,
  io
) => {
  const {
    _id,
    isDeleted,
    isSeen,
    fileUrl,
    imageUrl,
    message,
    chatId,
    createdAt,
    seenBy,
  } = savedMessage;

  const updatedMessage = {
    createdAt,
    seenBy,
    _id,
    isDeleted,
    isSeen,
    fileUrl,
    imageUrl,
    message,
    chatId,
    senderId: isForReqUser
      ? null
      : {
          _id: reqUser._id,
          name: reqUser.name,
          lastName: reqUser.lastName,
          image: reqUser.image,
        },
  };

  const eventMessage = {
    isGroup: false,
    _id: chat._id,
    participants: [
      {
        _id: isForReqUser ? receiverUser._id : reqUser._id,
        name: isForReqUser ? receiverUser.name : reqUser.name,
        lastName: isForReqUser ? receiverUser.lastName : reqUser.lastName,
        image: isForReqUser ? receiverUser.image : reqUser.image,
        status: isForReqUser
          ? loggedUsers[receiverUser._id]?.status ?? 'offline'
          : 'active',
      },
    ],
    unreadedMessages: chat.unreadedMessages.find((info) =>
      info.userId.equals(isForReqUser ? reqUser._id : receiverUser._id)
    ).count,
    message: [updatedMessage],
  };

  io.to(socketId).emit('newMessage', eventMessage);
};

exports.informUsersAboutNewMessageInSingleChat = async (
  receiverId,
  socket,
  io,
  isTextMessage,
  isImageMessage,
  isFileMessage,
  message
) => {
  const { receiver, user: requestUser } = await findRequestUserAndReciverUser(
    receiverId,
    socket
  );

  const participants = [requestUser._id, receiver._id];
  const chat = await checkForUsersChatIsExistsAndUserVisibility(participants);

  const newMessage = await Message.create({
    senderId: requestUser._id,
    chatId: chat._id,
    message: isTextMessage ? message : undefined,
    visibleFor: participants,
    imageUrl: isImageMessage ? message : undefined,
    fileUrl: isFileMessage ? message : undefined,
  });

  if (!newMessage) throw new AppError('Fail to send message!', 400);

  sendMessageToReceiverAndRequestUser(
    requestUser,
    receiver,
    true,
    socket.id,
    chat,
    newMessage,
    io
  );

  const loggedReceiver = loggedUsers[receiver._id];

  if (loggedReceiver) {
    sendMessageToReceiverAndRequestUser(
      requestUser,
      receiver,
      false,
      loggedReceiver.socketId,
      chat,
      newMessage,
      io
    );
  }
};
