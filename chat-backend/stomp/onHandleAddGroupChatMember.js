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

onHandleAddGroupChatMember = catchAsyncStomp(
  async (eventDetails, socket, io) => {
    const { members, chatId } = eventDetails;

    const memebersIds = members?.map((member) => member.id);

    const [groupChat, reqUser, usersToAdd] = await Promise.all([
      GroupChat.findById(chatId),
      getUserFromSocketHeader(socket),
      User.find({ _id: { $in: memebersIds } }),
    ]);

    if (!groupChat) throw new AppError('No group chat found!', 400);

    if (
      reqUser._id !== groupChat.createdBy &&
      !groupChat?.admins?.some((admin) => admin.equals(reqUser._id))
    )
      throw new AppError(
        'You dont have permission to add users to group chat!'
      );

    if (!usersToAdd?.length === members?.length)
      throw new AppError('Invalid users to add!');

    let message = `${reqUser.name} ${reqUser.lastName} has added `;

    members.forEach((member) => {
      if (
        !groupChat.participants?.some((participant) =>
          participant.equals(member.id)
        )
      ) {
        groupChat.unreadedMessages.push({
          userId: member.id,
          count: 0,
        });
        groupChat.visibleFor.push(member.id);
        groupChat.participants.push(member.id);
        message = message + member.name + ' ' + member.lastName + ',';
      }
    });

    if (message === `${reqUser.name} ${reqUser.lastName} has added `) {
      throw new AppError('Users are alerdy in group chat!');
    }

    message = message + ' to group chat!';

    groupChat.save();

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
        io.to(participantDetails.socketId).emit('addedUserToGroupChat', {
          addedUsers: members,
          chatId: chatId,
        });
        if (members.some((member) => member.id === participant.toString())) {
          io.to(participantDetails.socketId).emit('newGroupChat', {
            chatName: groupChat.chatName,
            _id: groupChat._id,
            unreadedMessages: 0,
            visibleFor: undefined,
            participants: groupChat.participants,
            admins: groupChat.admins,
            createdBy: groupChat.createdBy,
          });
        }
      }
    });
  }
);

module.exports = onHandleAddGroupChatMember;
