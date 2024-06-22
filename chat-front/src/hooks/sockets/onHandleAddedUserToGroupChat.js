export function onHandleAddedUserToGroupChat(
  socket,
  queryClient,
  selectedChat,
  setSelectedChat
) {
  socket.on('addedUserToGroupChat', (eventDetails) => {
    const { addedUsers, chatId } = eventDetails;

    if (selectedChat?.id === chatId) {
      setSelectedChat((prev) => ({
        ...prev,
        participants: [
          ...prev.participants,
          ...addedUsers.map((user) => ({ ...user, _id: user.id })),
        ],
      }));
    }

    queryClient.setQueryData(['groupChats'], (prevData) => {
      if (!prevData) return;

      const updatedData = prevData.data.map((groupChat) => {
        if (!groupChat.id === chatId) return groupChat;

        return {
          ...groupChat,
          participants: [...groupChat.participants, ...addedUsers],
        };
      });

      return { ...prevData, data: updatedData };
    });
  });
}
