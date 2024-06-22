// catch util
const catchAsyncStomp = require('../utils/catchAsyncStomp');
const AppError = require('../utils/appError');

// models
const GroupChat = require('../models/groupChatModel');
const User = require('../models/userModel');

// stomp utils
const { getUserFromSocketHeader } = require('./stompUtils');

const { loggedUsers } = require('./loggedUsers');

const {
  informUsersAboutNewMessageInGroupChat,
} = require('./infromGroupChatUsers');

onHandleKickUserFromGroupChat = catchAsyncStomp(
  async (eventDetails, socket, io) => {
    const { chatId, userId } = eventDetails;

    const [reqUser, groupChat, userToBeKickedFromChat] = await Promise.all([
      getUserFromSocketHeader(socket),
      GroupChat.findOne({ _id: chatId }),
      User.findById(userId),
    ]);

    if (!groupChat) throw new AppError('No group chat found!', 404);

    if (groupChat.createdBy.equals(userId))
      throw new AppError('You cannot kick chat creator!', 400);

    if (!userToBeKickedFromChat)
      throw new AppError('No user found to be kicked from chat!', 404);

    if (!groupChat.admins.some((adminId) => adminId.equals(reqUser._id))) {
      throw new AppError('U dont have permisison to kick user from chat!', 403);
    }

    const fieldsToFilterUserId = ['visibleFor', 'admins', 'participants'];

    fieldsToFilterUserId.forEach((field) => {
      groupChat[field] = groupChat[field].filter((id) => !id.equals(userId));
    });

    groupChat.save();

    let message = `${reqUser.name} ${reqUser.lastName} has kicked ${userToBeKickedFromChat.name} ${userToBeKickedFromChat.lastName} from group chat!`;

    informUsersAboutNewMessageInGroupChat(
      message,
      true,
      false,
      false,
      chatId,
      socket,
      io
    );

    const kickedUserDetails = loggedUsers[userId];

    if (kickedUserDetails) {
      io.to(kickedUserDetails.socketId).emit('kickedFromChat', {
        chatId: chatId,
      });
    }

    groupChat.participants.forEach((participant) => {
      const participantDetails = loggedUsers[participant.toString()];
      if (participantDetails) {
        io.to(participantDetails.socketId).emit('kickedUserFromChat', {
          userId: userId,
          chatId: chatId,
        });
      }
    });
  }
);

module.exports = onHandleKickUserFromGroupChat;
