export const onNewMessage = (
  socket,
  queryClient,
  setSelectedChat,
  selectedChat
) => {
  socket.on('newMessage', (eventDetails) => {
    const { isGroup, _id, participants, unreadedMessages } = eventDetails;

    selectedChat?.id === _id &&
      setSelectedChat((prev) => ({
        ...prev,
        unreadedMessages: unreadedMessages,
      }));

    if (
      !isGroup &&
      selectedChat?.participantId === participants[0]._id &&
      !selectedChat?.id
    ) {
      // if we select searched user and send message we are setting returned chat to selected one
      const { name, lastName, status, _id: participantId } = participants[0];
      setSelectedChat(() => ({
        id: _id,
        name,
        lastName,
        status,
        participantId,
        unreadedMessages,
        isGroup,
      }));
    }
    // updating single chat messages data if exists in cash
    updateSingleChatData(queryClient, eventDetails);

    // updating group chat unreaded messages if it is message received from other user
    isGroup &&
      eventDetails.message.senderId &&
      updateGroupChatData(queryClient, eventDetails);

    // updated recent chats if it is not group
    !isGroup && updateRecentChatBar(queryClient, eventDetails);
  });
};

const updateRecentChatBar = (queryClient, eventDetails) => {
  queryClient.setQueryData(['chats'], (prevData) => {
    if (!prevData) return;

    let data = prevData.pages.reduce((acc, page) => acc.concat(page.data), []);
    const prevDataLength = data.length;

    data = [
      eventDetails,
      ...data.filter((chat) => chat._id !== eventDetails._id),
    ];

    const updatedPages = prevData.pages.map((page, i) => {
      return { ...page, data: data.slice(i * 20, (i + 1) * 20) };
    });

    if (
      prevDataLength !== 0 &&
      prevDataLength % 20 === 0 &&
      prevDataLength < data.length
    ) {
      const lastPage = prevData.pages[prevData.pages.length - 1];
      updatedPages.push({
        status: 'success',
        data: [data[data.length - 1]],
        currentPage: lastPage.currentPage + 1,
        nextPage: lastPage.currentPage ? lastPage.currentPage + 2 : null,
        hasMore: lastPage.hasMore,
      });
    }

    return { ...prevData, pages: updatedPages };
  });
};

const updateGroupChatData = (queryClient, eventDetails) => {
  queryClient.setQueryData(['groupChats'], (prevData) => {
    if (!prevData) return;
    return {
      ...prevData,
      data: prevData.data.map((groupChat) =>
        groupChat._id === eventDetails.chatId
          ? {
              ...groupChat,
              unreadedMessages: groupChat.unreadedMessages + 1,
            }
          : groupChat
      ),
    };
  });
};

const updateSingleChatData = (queryClient, eventDetails) => {
  const { isGroup, message, _id, chatId } = eventDetails;

  queryClient.setQueryData(['chat', isGroup ? chatId : _id], (prevData) => {
    if (!prevData) return;
    let carryOverMessage = isGroup
      ? message
      : { ...message[0], id: message[0]._id };

    const updatedPages = prevData.pages.map((page) => {
      const newMessages = [carryOverMessage, ...page.messages];

      if (newMessages.length > 20) {
        carryOverMessage = newMessages.pop();
      } else {
        carryOverMessage = null;
      }

      return { ...page, messages: newMessages };
    });

    if (carryOverMessage) {
      const { currentPage, hasMore, nextPage } = prevData.pages[
        prevData.pages.length - 1
      ] ?? { currentPage: 0, hasMore: false, nextPage: null };

      updatedPages.push({
        currentPage: currentPage + 1,
        nextPage: nextPage + 1,
        hasMore,
        messages: [carryOverMessage],
      });
    }
    return { ...prevData, pages: updatedPages };
  });
};
