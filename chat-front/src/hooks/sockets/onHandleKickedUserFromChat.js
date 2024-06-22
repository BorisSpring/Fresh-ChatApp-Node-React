export function onHandleKickedUserFromChat(
  socket,
  queryClient,
  selectedChat,
  setSelectedChat
) {
  socket.on('kickedUserFromChat', (eventDetails) => {
    const { userId, chatId } = eventDetails;

    if (chatId === selectedChat?.id) {
      setSelectedChat((prev) => ({
        ...prev,
        admins: prev.admins.filter((adminId) => adminId !== userId),
        participants: prev.participants.filter(
          (participants) => participants._id !== userId
        ),
      }));
    }

    queryClient.setQueryData(['groupChats'], (prevData) => {
      if (!prevData) return;

      const updatedData = prevData.data.map((groupChat) => {
        if (groupChat._id !== chatId) return groupChat;

        return {
          ...groupChat,
          participants: updateGroupChatParticipants(groupChat, userId),
          admins: updateGroupChatAdmins(groupChat, userId),
        };
      });

      return { ...prevData, data: updatedData };
    });
  });
}

function updateGroupChatParticipants(groupChat, userId) {
  return groupChat.participants.filter(
    (participant) => participant._id !== userId
  );
}

function updateGroupChatAdmins(groupChat, userId) {
  return groupChat.admins.filter((adminId) => adminId !== userId);
}
