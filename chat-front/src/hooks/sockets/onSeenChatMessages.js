export function onSeenChatMessages(socket, queryClient) {
  socket.on('seenChatMessages', (eventDetails) => {
    const { userId, chatId, isGroup } = eventDetails;
    if (!isGroup) {
      updateRecentChatBar(queryClient, chatId, userId);
    }

    updateSingleChatMessages(queryClient, chatId, userId);
  });
}

const updateSingleChatMessages = (queryClient, chatId, userId) => {
  queryClient.setQueryData(['chat', chatId], (prevData) => {
    if (!prevData) return;

    const updatedPages = prevData.pages.map((page) => {
      const updatedData = page.messages.map((message) => {
        if (message.senderId) return message;

        const exists = message?.seenBy?.some?.(
          (seenBy) => seenBy?.userId === userId
        );
        if (exists) return message;

        return {
          ...message,
          seenBy: [...message.seenBy, { userId: userId, seenAt: Date.now() }],
        };
      });
      return { ...page, messages: updatedData };
    });

    return { ...prevData, pages: updatedPages };
  });
};

const updateRecentChatBar = (queryClient, chatId, userId) => {
  queryClient.setQueryData(['chats'], (prevData) => {
    if (!prevData) return;
    // iterating over all pages
    const updatedPages = prevData.pages.map((page) => {
      // updating single page
      const updatedData = page.data.map((chat) =>
        chat._id === chatId
          ? // updating chat if recent chat id is same as received chat id  otherwise returning same chat
            {
              ...chat,
              message: [
                {
                  ...chat.message[0],
                  seenBy: [{ userId: userId, seenAt: Date.now() }],
                },
              ],
            }
          : chat
      );
      // returning updated page
      return { ...page, data: updatedData };
    });
    //  returning updated overall data
    return { ...prevData, pages: updatedPages };
  });
};
