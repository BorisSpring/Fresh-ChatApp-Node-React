const { server, io } = require('./app');
const dotenv = require('dotenv');
const mongoose = require(`mongoose`);

// socket handlers
const onHandleNewMessage = require('./stomp/onHandleNewMessage');
const onHandleDeleteChat = require('./stomp/onHandleDeleteChat');
const onHandleDeleteMessageForAll = require('./stomp/onHandleDeleteMessageForAllRequest');
const onHandleDeleteMessageMe = require('./stomp/onHandleDeleteMessageMeRequest');
const onHandleChangeStatus = require('./stomp/onHandleChangeStatus');
const onHandleSendFileChunk = require('./stomp/onSendFileChunk');
const onHandleOpenChat = require('./stomp/onHandleOpenChat');
const onHandleCreateGroupChat = require('./stomp/onHandleCreateGroupChat');
const onHandleLeaveGroupChat = require('./stomp/onHandleLeaveGroupChat');
const onHandleGrantOrRevokeAdminAuthority = require('./stomp/onHandleGrantOrRevokeAdminAuthority');
const onHandleKickUserFromGroupChat = require('./stomp/onHandleKickUserFromGroupChat');
const onHandleAddGroupChatMember = require('./stomp/onHandleAddGroupChatMember');
const onHandleDeleteGroupChat = require('./stomp/onHandleDeleteGroupChat');

// configuring path variables
dotenv.config({ path: './config.env' });

// connecting to mongo db
mongoose
  .connect(process.env.DATABASE)
  .then(() => {
    console.log('Successfully connected to mongo database');
  })
  .catch((err) => {
    console.error('Error connecting to mongo database');
    console.error(`Err: ${err.message}`);
    process.exit(1);
  });

const port = process.env.PORT || 3000;

// runing the server
server.listen(port, 'localhost', () => {
  console.log(`Server listening on port ${port}`);
});

// displaying error on uncaught exceptions
server.on('uncaughtException', (err) => {
  console.error('Uncaught exception');
  console.error(`Name: ${err.name}`);
  console.error(`Message: ${err.message}`);
  server.close(() => process.exit(1));
});

// dispalying erorrs on uncaught promises
server.on('uncaughtRejection', (err) => {
  console.error('Uncaught rejection');
  console.error(`Name: ${err.name}`);
  console.error(`Message: ${err.message}`);
  server.close(() => process.exit(1));
});

// configuration for socket handlers
io.on('connection', (socket) => {
  socket.on('error', (err) => {
    console.error(err.message);
  });

  socket.on('changeStatus', (eventDetails) =>
    onHandleChangeStatus(eventDetails, socket, io)
  );

  socket.on(
    'newMessage',
    async (eventDetails) => await onHandleNewMessage(eventDetails, socket, io)
  );

  socket.on(
    'deleteMessageMeRequest',
    async (eventDetails) =>
      await onHandleDeleteMessageMe(eventDetails, socket, io)
  );

  socket.on(
    'deleteMessageForAllRequest',
    async (eventDetails) =>
      await onHandleDeleteMessageForAll(eventDetails, socket, io)
  );

  socket.on(
    'sendFileChunk',
    async (eventDetails) =>
      await onHandleSendFileChunk(eventDetails, socket, io)
  );

  socket.on(
    'deleteChat',
    async (eventDetails) => await onHandleDeleteChat(eventDetails, socket, io)
  );

  socket.on(
    'openChat',
    async (eventDetails) => await onHandleOpenChat(eventDetails, socket, io)
  );

  socket.on(
    'createGroupChat',
    async (eventDetails) =>
      await onHandleCreateGroupChat(eventDetails, socket, io)
  );

  socket.on(
    'leaveGroupChat',
    async (eventDetails) =>
      await onHandleLeaveGroupChat(eventDetails, socket, io)
  );

  socket.on(
    'grantOrRevokeAdminAuthority',
    async (eventDetails) =>
      await onHandleGrantOrRevokeAdminAuthority(eventDetails, socket, io)
  );

  socket.on('kickUserFromGroupChat', async (eventDetails) => {
    await onHandleKickUserFromGroupChat(eventDetails, socket, io);
  });

  socket.on('addGroupChatMember', async (eventDetails) => {
    await onHandleAddGroupChatMember(eventDetails, socket, io);
  });

  socket.on('deleteGroupChat', async (eventDetails) => {
    await onHandleDeleteGroupChat(eventDetails, socket, io);
  });
});
