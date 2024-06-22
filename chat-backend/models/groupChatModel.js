const mongoose = require('mongoose');

const groupChatSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
      },
    ],
    createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
    isGroup: {
      type: Boolean,
      default: false,
    },
    chatName: {
      type: String,
      minLength: [1, 'Minimum length for chat name is 1 character'],
      maxLength: [20, 'Maximum length for chat name is 20 characters'],
      trim: true,
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
    visibleFor: [
      {
        type: mongoose.Schema.ObjectId,
        required: true,
      },
    ],
    admins: {
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

const GroupChat = mongoose.model('GroupChat', groupChatSchema, 'groupChats');

module.exports = GroupChat;
