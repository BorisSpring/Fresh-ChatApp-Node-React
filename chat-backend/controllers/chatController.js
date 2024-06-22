// utils
const catchAsync = require('../utils/catchAsync');

// models
const Message = require('../models/messageModel');
const Chat = require('../models/chatModel');
const GroupChat = require('../models/groupChatModel');

// currently logged users on server
const { loggedUsers } = require('../stomp/loggedUsers');

findUnreadedMessageCountForUsersChats = (chats, reqUserId) => {
  return chats.map((chat) => {
    const userUnreadMessages = chat.unreadedMessages?.find((usersInfos) =>
      usersInfos?.userId?.equals(reqUserId)
    );
    return {
      ...chat,
      unreadedMessages: userUnreadMessages?.count ?? 0,
    };
  });
};

findUserStatusForChatParticipant = (chats) => {
  return chats.map((chat) => ({
    ...chat,
    participants: [
      {
        ...chat.participants[0],
        status: loggedUsers?.[chat.participants[0]._id]?.status ?? 'offline',
      },
    ],
  }));
};

// find single user chats with last message orderer by created message desc
exports.findUserChats = catchAsync(async (req, res, next) => {
  const page = req.query.page || 1;

  let chats = await Chat.aggregate([
    {
      $match: {
        participants: req.user._id,
        visibleFor: req.user._id,
      },
    },
    {
      $unwind: '$participants',
    },
    {
      $match: {
        participants: { $ne: req.user._id },
      },
    },
    {
      $lookup: {
        from: 'chatUsers',
        localField: 'participants',
        foreignField: '_id',
        as: 'participants',
      },
    },
    {
      $lookup: {
        from: 'chatMessages',
        let: { chatId: '$_id' },
        pipeline: [
          { $match: { $expr: { $eq: ['$chatId', '$$chatId'] } } },
          { $sort: { createdAt: -1 } },
          { $limit: 1 },
        ],
        as: 'message',
      },
    },
    {
      $project: {
        'participants._id': 1,
        'participants.name': 1,
        'participants.lastName': 1,
        'participants.image': 1,
        isGroup: 1,
        unreadedMessages: 1,
        'message.senderId': 1,
        'message.message': 1,
        'message.imageUrl': 1,
        'message.fileUrl': 1,
        'message.isDeleted': 1,
        'message.seenBy': 1,
        'message.createdAt': 1,
      },
    },
  ]);

  chats = findUnreadedMessageCountForUsersChats(chats, req.user._id);

  chats = findUserStatusForChatParticipant(chats);

  const totalDocuments = await Chat.countDocuments({
    participants: req.user._id,
    visibleFor: req.user._id,
    isGroup: false,
  });

  const totalPages = Math.ceil(totalDocuments / 20);
  const hasMore = page < totalPages;

  res.status(200).json({
    status: 'success',
    data: chats,
    currentPage: page,
    nextPage: hasMore ? page + 1 : null,
    hasMore,
  });
});

// get single chat messages
exports.findChatMessages = catchAsync(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  const messages = await Message.find({
    chatId: req.params.chatId,
    visibleFor: req.user._id,
  })
    .select(
      'senderId message imageUrl fileUrl seenBy createdAt id isDeleted chatId'
    )
    .populate({
      path: 'senderId',
      match: { _id: { $ne: req.user._id } },
      select: ' name lastName image id',
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const totalDocuments = await Message.countDocuments({
    chatId: req.params.chatId,
    visibleFor: req.user._id,
  });

  const totalPages = Math.ceil(totalDocuments / limit);
  const hasMore = page < totalPages;

  res.status(200).json({
    status: 'Success',
    messages,
    currentPage: page,
    nextPage: hasMore ? page + 1 : null,
    hasMore,
  });
});

// get group chat messages
exports.findUserGroupChats = catchAsync(async (req, res, next) => {
  const reqUserId = req.user._id;

  let groupChats = await GroupChat.find({
    participants: reqUserId,
    visibleFor: reqUserId,
  })
    .select('isGroup chatName createdBy admins unreadedMessages participants')
    .populate({
      path: 'participants',
      select: 'name lastName image',
      match: { _id: { $ne: req.user._id } },
    })
    .sort('-createdAt')
    .lean();

  groupChats = findUnreadedMessageCountForUsersChats(groupChats, reqUserId);

  res.status(200).json({
    status: 'success',
    data: groupChats,
  });
});
