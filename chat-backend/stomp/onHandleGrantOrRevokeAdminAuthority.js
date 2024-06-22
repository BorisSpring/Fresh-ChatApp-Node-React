// catch util
const catchAsyncStomp = require('../utils/catchAsyncStomp');
const AppError = require('../utils/appError');

// stomp utils
const { getUserFromSocketHeader } = require('./stompUtils');

// models
const GroupChat = require('../models/groupChatModel');
const User = require('../models/userModel');

const { loggedUsers } = require('./loggedUsers');
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;

const {
  informUsersAboutNewMessageInGroupChat,
} = require('./infromGroupChatUsers');

onHandleGrantOrRevokeAdminAuthority = catchAsyncStomp(
  async (eventDetails, socket, io) => {
    const { userId, chatId } = eventDetails;

    const [reqUser, chatUser, groupChat] = await Promise.all([
      getUserFromSocketHeader(socket),
      User.findById(userId),
      GroupChat.findOne({
        _id: chatId,
      }),
    ]);

    if (!groupChat) throw new AppError('There is no chat found', 404);

    if (!groupChat.createdBy.equals(reqUser._id))
      throw new AppError(
        'You dont have permissions! You are not chat creator!',
        403
      );

    if (!chatUser) throw new AppError('Invalid user!', 400);

    const isRevoke = groupChat.admins.some((adminId) => adminId.equals(userId));

    groupChat.admins = isRevoke
      ? groupChat.admins.filter((adminId) => !adminId.equals(userId))
      : groupChat.admins.concat(new ObjectId(userId));

    groupChat.save();

    let message = `${reqUser.name} ${reqUser.lastName} has ${
      isRevoke ? ' revoke ' : ' grant '
    } admin access to  ${chatUser.name} ${chatUser.lastName}`;

    informUsersAboutNewMessageInGroupChat(
      message,
      true,
      false,
      false,
      chatId,
      socket,
      io
    );

    groupChat.participants.forEach((participant) => {
      const participantDetails = loggedUsers[participant.toString()];
      if (participantDetails) {
        io.to(participantDetails.socketId).emit('grantOrRevokeInfo', {
          isRevoke: isRevoke,
          userId: userId,
          chatId: chatId,
        });
      }
    });
  }
);

module.exports = onHandleGrantOrRevokeAdminAuthority;
