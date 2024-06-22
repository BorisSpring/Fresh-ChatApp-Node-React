import toast from 'react-hot-toast';

export const onDeletedMessageForRequestUserResponse = (socket, queryClient) => {
  socket.on('deletedMessageForRequestUserResponse', (eventDetails) => {
    const { messageId, chatId } = eventDetails;

    queryClient.setQueryData(['chat', chatId], (prevData) =>
      removeMessageFromConversation(messageId, prevData)
    );

    toast.success('Messages has been deleted only for you!');
  });
};

const removeMessageFromConversation = (messageId, prevData) => {
  if (!prevData) return;

  let isMessageFound = false;
  let messagePageIndex;

  let updatedPages = prevData.pages.map((page, i) => {
    if (!isMessageFound && page.messages.some((msg) => msg.id === messageId)) {
      isMessageFound = true;
      messagePageIndex = i;

      const filteredMessages = page.messages.filter(
        (msg) => msg.id !== messageId
      );

      const nextPage = prevData.pages[i + 1];
      return {
        ...page,
        messages: nextPage
          ? [...filteredMessages, nextPage.messages.shift()]
          : [...filteredMessages],
      };
    }

    if (isMessageFound && messagePageIndex !== i) {
      const nextPage = prevData.pages[i + 1];
      return {
        ...page,
        messages: nextPage
          ? [...page.messages, nextPage.messages.shift()]
          : page.messages,
      };
    }

    return page;
  });

  updatedPages = updatedPages.filter((page) => page.messages.length !== 0);

  return { ...prevData, pages: [...updatedPages] };
};
