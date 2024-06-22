const mongoose = require('mongoose');
const dotenv = require('dotenv');

// importing models
const Chat = require('../models/chatModel');
const User = require('../models/userModel');
const Message = require('../models/messageModel');
const GroupChat = require('../models/groupChatModel');

dotenv.config({ path: './config.env' });

mongoose
  .connect(process.env.DATABASE)
  .then(console.log('connecting to database'))
  .catch((err) => {
    console.error('Error connecting to database');
    console.error(err.message);
  });

const users = [
  {
    // boris
    _id: '665c7041e0477c95d0f7ef9a',
    name: 'boris',
    lastName: 'Dimitrijevic',
    password: '12345678',
    passwordConfirm: '12345678',
    isBanned: false,
    email: 'borisdimitrijevicit@gmail.com',
    createdAt: '2024-06-02T13:07:59.568+00:00',
    image: 'default.png',
    __v: 0,
  },
  {
    // andrijana
    _id: '665f1c77a5342bb9d18ab7a8',
    name: 'andrijana',
    lastName: 'molnar',
    password: '12345678',
    passwordConfirm: '12345678',
    isBanned: false,
    isActive: true,
    email: 'andrijana@gmail.com',
    image: 'default.png',
    createdAt: '2024-06-04T13:53:59.336+00:00',
    updatedAt: '2024-06-04T13:53:59.336+00:00',
    __v: 0,
  },
  {
    // darko
    _id: '666f1c77a5342bb9d18ab7a8',
    name: 'darko',
    lastName: 'smradic',
    password: '12345678',
    passwordConfirm: '12345678',
    isBanned: false,
    isActive: true,
    email: 'darko@gmail.com',
    image: 'default.png',
    createdAt: '2024-06-04T13:53:59.336+00:00',
    updatedAt: '2024-06-04T13:53:59.336+00:00',
    __v: 0,
  },
  {
    // darko
    _id: '988f1c77a5342bb9d18ab7a8',
    name: 'darko1',
    lastName: 'smradic',
    password: '12345678',
    passwordConfirm: '12345678',
    isBanned: false,
    isActive: true,
    email: 'darko1@gmail.com',
    image: 'default.png',
    createdAt: '2024-06-04T13:53:59.336+00:00',
    updatedAt: '2024-06-04T13:53:59.336+00:00',
    __v: 0,
  },
  {
    // darko
    _id: '999f1c77a5342bb9d18ab7a8',
    name: 'darko2',
    lastName: 'smradic',
    password: '12345678',
    passwordConfirm: '12345678',
    isBanned: false,
    isActive: true,
    email: 'darko2@gmail.com',
    image: 'default.png',
    createdAt: '2024-06-04T13:53:59.336+00:00',
    updatedAt: '2024-06-04T13:53:59.336+00:00',
    __v: 0,
  },
];

const chats = [
  {
    _id: '667f1c77a5342bb9d18ab7a8',
    // boris andrijana
    participants: ['665c7041e0477c95d0f7ef9a', '665f1c77a5342bb9d18ab7a8'],
    // boris
    createdBy: '665c7041e0477c95d0f7ef9a',
    unreadedMessages: [
      { userId: '665c7041e0477c95d0f7ef9a', count: 2 },
      { userId: '665f1c77a5342bb9d18ab7a8', count: 1 },
    ],
    isGroup: false,
    // boris andrijana
    visibleFor: ['665c7041e0477c95d0f7ef9a', '665f1c77a5342bb9d18ab7a8'],
  },
  // {
  //   _id: '668f1c77a5342bb9d18ab7a8',
  //   // boris darko
  //   participants: ['665c7041e0477c95d0f7ef9a', '666f1c77a5342bb9d18ab7a8'],
  //   // boris
  //   createdBy: '665c7041e0477c95d0f7ef9a',
  //   isGroup: false,
  //   // boris
  //   visibleFor: ['665c7041e0477c95d0f7ef9a'],
  // },
];

const messages = [
  {
    // boris
    senderId: '665c7041e0477c95d0f7ef9a',
    chatId: '667f1c77a5342bb9d18ab7a8',
    message: 'Hello andrijana',
    // boris andrijana
    visibleFor: ['665c7041e0477c95d0f7ef9a', '665f1c77a5342bb9d18ab7a8'],
    createdAt: '2024-06-04T18:00:00.000Z',
  },
  {
    senderId: '665f1c77a5342bb9d18ab7a8',
    chatId: '667f1c77a5342bb9d18ab7a8',
    message: 'Hello boris!',
    // boris andrijana
    visibleFor: ['665c7041e0477c95d0f7ef9a', '665f1c77a5342bb9d18ab7a8'],
    createdAt: '2024-06-04T18:03:00.000Z',
  },
  {
    // boris
    senderId: '665c7041e0477c95d0f7ef9a',
    chatId: '667f1c77a5342bb9d18ab7a8',
    message:
      'I forgot when we need to be in office tomorrow, could u remind me?',
    // boris andrijana
    visibleFor: ['665c7041e0477c95d0f7ef9a', '665f1c77a5342bb9d18ab7a8'],
    createdAt: '2024-06-04T18:06:00.000Z',
  },
  {
    // andrijana
    senderId: '665f1c77a5342bb9d18ab7a8',
    chatId: '667f1c77a5342bb9d18ab7a8',
    message: 'Yes of course, 10am!',
    // boris andrijana
    visibleFor: ['665c7041e0477c95d0f7ef9a', '665f1c77a5342bb9d18ab7a8'],
    createdAt: '2024-06-04T19:00:00.000Z',
  },
  {
    // boris
    senderId: '665c7041e0477c95d0f7ef9a',
    chatId: '667f1c77a5342bb9d18ab7a8',
    message: 'Thank you darko!',
    // boris andrijana
    visibleFor: ['665c7041e0477c95d0f7ef9a', '665f1c77a5342bb9d18ab7a8'],
    createdAt: '2024-06-04T19:30:00.000Z',
  },
  {
    // andrijana
    senderId: '665f1c77a5342bb9d18ab7a8',
    chatId: '667f1c77a5342bb9d18ab7a8',
    message: 'Youre welcome boris!',
    // boris andrijana
    visibleFor: ['665c7041e0477c95d0f7ef9a', '665f1c77a5342bb9d18ab7a8'],
    createdAt: '2024-06-04T20:11:00.000Z',
  },
];

importData();

async function importData() {
  await Promise.all([
    User.deleteMany(),
    Message.deleteMany(),
    Chat.deleteMany(),
    GroupChat.deleteMany(),
  ]);

  await Promise.all([
    User.insertMany(users),
    Chat.insertMany(chats),
    Message.insertMany(messages),
  ]);

  console.log('Finsihed importing data...');
  process.exit(1);
}
