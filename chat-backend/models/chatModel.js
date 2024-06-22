const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema(
  {
    participants: {
      type: [mongoose.Schema.ObjectId],
      required: true,
      ref: 'User',
    },
    createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
    isGroup: {
      type: Boolean,
      default: false,
    },
    unreadedMessages: [
      {
        userId: {
          type: mongoose.Schema.ObjectId,
          ref: 'User',
        },
        count: {
          type: Number,

          default: 0,
        },
      },
    ],
    visibleFor: {
      type: [mongoose.Schema.ObjectId],
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, rel) {
        rel.id = doc._id;
        delete rel._id;
        delete rel.__v;
      },
    },
    toObject: { virtuals: true },
  }
);

chatSchema.virtual('message', {
  ref: 'Message',
  localField: '_id',
  foreignField: 'chatId',
  options: {
    sort: { createdAt: -1 },
    select: 'message  createdAt fileUrl imageUrl seenBy senderId',
    limit: 1,
  },
});

const Chat = mongoose.model('Chat', chatSchema, 'chats');

module.exports = Chat;
