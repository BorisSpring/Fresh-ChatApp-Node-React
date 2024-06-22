const {
  informUsersAboutNewMessageInGroupChat,
} = require('../stomp/infromGroupChatUsers');

const {
  informUsersAboutNewMessageInSingleChat,
} = require('../stomp/informSingleChatUsers');

// utils
const catchAsyncStomp = require('../utils/catchAsyncStomp');

// on handlign new message event
onHandleNewMessage = catchAsyncStomp(async (eventDetails, socket, io) => {
  const { message, receiverId, isGroup, chatId } = eventDetails;

  if (isGroup) {
    await informUsersAboutNewMessageInGroupChat(
      message,
      true,
      false,
      false,
      chatId,
      socket,
      io
    );
  } else {
    await informUsersAboutNewMessageInSingleChat(
      receiverId,
      socket,
      io,
      true,
      false,
      false,
      message
    );
  }
});

module.exports = onHandleNewMessage;
