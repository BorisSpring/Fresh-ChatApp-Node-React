export const onUserStatus = (
  socket,
  queryClient,
  setSelectedChat,
  selectedChat
) => {
  socket.on('userStatus', (eventDetails) => {
    const { userId, status } = eventDetails;

    if (!selectedChat?.isGroup && selectedChat?.participantId === userId) {
      setSelectedChat((prev) => ({ ...prev, status: status }));
    }

    queryClient.setQueryData(['chats'], (prevData) => {
      if (!prevData) return prevData;

      const updatedPages = prevData.pages.map((page) => {
        const updatedData = page.data.map((chat) => {
          return updateChatParticipants(chat, userId, status);
        });
        return { ...page, data: updatedData };
      });
      return { ...prevData, pages: updatedPages };
    });
  });
};

const updateChatParticipants = (chatDetails, userId, status) => {
  const updatedParitipants = chatDetails.participants.map((participant) =>
    participant._id === userId
      ? { ...participant, status: status }
      : participant
  );
  return { ...chatDetails, participants: updatedParitipants };
};
