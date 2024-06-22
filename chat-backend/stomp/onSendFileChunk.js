const fs = require('fs');
const path = require('path');

// utils
const catchAsyncStomp = require('../utils/catchAsyncStomp');

const {
  informUsersAboutNewMessageInSingleChat,
} = require('../stomp/informSingleChatUsers');

const {
  informUsersAboutNewMessageInGroupChat,
} = require('../stomp/infromGroupChatUsers');

const filesChunks = {};

handleReceiveFileChunk = (chunkIndex, data, fileName, totalChunks) => {
  if (!filesChunks[fileName]) {
    filesChunks[fileName] = [];
  }

  filesChunks[fileName][chunkIndex] = data;

  let isUploadFinished = false;

  if (filesChunks[fileName].length === totalChunks) {
    isUploadFinished = true;
  }

  return isUploadFinished;
};

saveFileToServer = (fileName, socket) => {
  const newFileName = `${Date.now()}-${fileName}`;

  const filePath = path.join(__dirname, '../public/img', newFileName);

  const combinedBuffer = Buffer.concat(filesChunks[fileName]);

  fs.writeFile(filePath, combinedBuffer, () => {
    socket.emit('error', { message: 'Fail to upload file!' });
  });

  return newFileName;
};

onHandleSendFileChunk = catchAsyncStomp(async (eventDetails, socket, io) => {
  console.log(eventDetails);
  const {
    chunkIndex,
    totalChunks,
    data,
    fileName,
    isGroup,
    receiverId,
    chatId,
    isImage,
  } = eventDetails;

  const isUploadFinished = handleReceiveFileChunk(
    chunkIndex,
    data,
    fileName,
    totalChunks
  );

  if (isUploadFinished) {
    const newFileName = saveFileToServer(fileName, socket);
    if (!isGroup) {
      await informUsersAboutNewMessageInSingleChat(
        receiverId,
        socket,
        io,
        false,
        isImage,
        !isImage,
        newFileName
      );
    } else {
      await informUsersAboutNewMessageInGroupChat(
        newFileName,
        false,
        isImage,
        !isImage,
        chatId,
        socket,
        io
      );
    }
  }
});

module.exports = onHandleSendFileChunk;
