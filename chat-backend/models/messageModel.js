const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.ObjectId,
      required: true,
      ref: 'User',
    },
    chatId: {
      type: mongoose.Schema.ObjectId,
      required: true,
      ref: 'Chat',
    },
    message: {
      type: String,
      minLength: [1, 'Minimum length is 1 character'],
      maxLength: [500, 'Maximum length is 500 characters'],
      trim: true,
    },
    visibleFor: {
      type: [mongoose.Schema.ObjectId],
      required: true,
    },
    imageUrl: {
      type: String,
      default: '',
    },
    fileUrl: {
      type: String,
      default: '',
    },
    seenBy: [
      {
        userId: {
          type: mongoose.Schema.ObjectId,
          ref: 'User',
        },
        seenAt: Date,
      },
    ],
    isDeleted: {
      type: Boolean,
      default: false,
    },
    oldTextMessage: String,
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

const Message = mongoose.model('Message', messageSchema, 'chatMessages');

module.exports = Message;
