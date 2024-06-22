import toast from 'react-hot-toast';

export const onDeleteMessageForAllResponse = (socket, queryClient) => {
  socket.on('deleteMessageForAllResponse', (eventDetails) => {
    const { messageId, chatId, isGroup } = eventDetails;

    if (!isGroup) {
      queryClient.setQueryData(['chats'], (prevData) =>
        updateMessageFromRecentChatsIfExists(chatId, messageId, prevData)
      );
    }

    queryClient.setQueryData(['chat', chatId], (prevData) =>
      updateMessageFromSingleChat(messageId, prevData)
    );

    toast.success('Messages has been deleted for all succesfully', {
      style: {
        fontSize: '14px',
      },
    });
  });
};

const updateMessageFromSingleChat = (messageId, prevData) => {
  if (!prevData) return;
  const updatedPages = prevData.pages.map((page) => {
    const updatedMessages = page.messages.map((msg) =>
      msg.id === messageId
        ? { ...msg, message: 'Message has been deleted', isDeleted: true }
        : msg
    );
    return { ...page, messages: updatedMessages };
  });
  return { ...prevData, pages: updatedPages };
};

const updateMessageFromRecentChatsIfExists = (chatId, messageId, prevData) => {
  if (!prevData) return;
  const updatedPages = prevData.pages.map((page) => {
    const updatedData = page.data.map((chat) =>
      chat._id === chatId ? updateChatMessage(chat, messageId) : chat
    );
    return { ...page, data: updatedData };
  });
  return { ...prevData, pages: updatedPages };
};

const updateChatMessage = (chat, messageId) => {
  return {
    ...chat,
    message:
      chat.message[0]._id === messageId
        ? [{ ...chat.message[0], message: 'Message has been deleted!' }]
        : chat.message,
  };
};
