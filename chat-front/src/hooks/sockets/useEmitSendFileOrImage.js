export function useEmitSendFileOrImage(socket) {
  const emitSendFileOrImage = (file, isGroup, receiverId, chatId, isImage) => {
    sendFile(file, socket, isGroup, receiverId, chatId, isImage);
  };

  return emitSendFileOrImage;
}

// chunk length will be 1mb
const chunkSize = 1024 * 1024;

function chunkFile(file) {
  const chunks = [];
  let start = 0;

  while (start < file.size) {
    const end = Math.min(start + chunkSize, file.size);
    const chunk = file.slice(start, end);
    chunks.push(chunk);
    start = end;
  }

  return chunks;
}

async function sendFileChunk(
  chunk,
  socket,
  index,
  totalChunks,
  fileName,
  isGroup,
  receiverId,
  chatId,
  isImage
) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const binaryData = reader.result;
      socket.emit('sendFileChunk', {
        chunkIndex: index,
        totalChunks: totalChunks,
        data: binaryData,
        fileName: fileName,
        isGroup: isGroup,
        receiverId: receiverId,
        chatId: chatId,
        isImage: isImage,
      });
      resolve();
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(chunk);
  });
}

async function sendFile(file, socket, isGroup, receiverId, chatId, isImage) {
  const chunks = chunkFile(file);
  const sendFileChunkPromises = chunks.map((chunk, index) =>
    sendFileChunk(
      chunk,
      socket,
      index,
      chunks.length,
      file.name,
      isGroup,
      receiverId,
      chatId,
      isImage
    )
  );

  await Promise.all(sendFileChunkPromises);
}
