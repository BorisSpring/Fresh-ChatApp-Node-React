export function onHandleGroupChatDeleted(
  socket,
  queryClient,
  selectedChat,
  setSelectedChat
) {
  socket.on('groupChatDeleted', (eventDetails) => {
    const { chatId } = eventDetails;

    selectedChat?.id === chatId && setSelectedChat(() => {});

    queryClient.setQueryData(['groupChats'], (prevData) => {
      if (!prevData) return;
      return {
        ...prevData,
        data: prevData.data.filter((groupChat) => groupChat._id !== chatId),
      };
    });
  });
}
