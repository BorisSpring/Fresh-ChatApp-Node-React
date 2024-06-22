export function onHandleLeavedGroupChat(socket, queryClient, setSelectedChat) {
  socket.on('leavedGroupChat', (eventDetails) => {
    const { chatId } = eventDetails;

    // set selected chat to null affter suscefully deleted
    setSelectedChat(() => {});

    // removing deleted chat from group chat data
    queryClient.setQueryData(['groupChats'], (prevData) => {
      if (!prevData) return;

      return {
        ...prevData,
        data: prevData.data.filter((groupChat) => groupChat._id !== chatId),
      };
    });

    // removing single chat data from cash
    queryClient.removeQueries(['chat', chatId]);
  });
}
