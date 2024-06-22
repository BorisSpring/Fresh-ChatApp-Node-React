export function onHandleGrantOrRevokeInfo(
  socket,
  queryClient,
  selectedChat,
  setSelectedChat
) {
  socket.on('grantOrRevokeInfo', (eventDetails) => {
    const { isRevoke, userId, chatId } = eventDetails;

    // updating selected chat if it match chat id
    if (selectedChat.id === chatId) {
      setSelectedChat((prev) => ({
        ...prev,
        admins: isRevoke
          ? prev.admins.filter((adminId) => adminId !== userId)
          : [...prev.admins, userId],
      }));
    }

    // updating group chat cash data
    queryClient.setQueryData(['groupChats'], (prevData) => {
      if (!prevData) return;
      const updatedData = prevData.data.map((groupChat) => {
        if (groupChat._id !== chatId) return groupChat;

        const newAdmins = isRevoke
          ? groupChat.admins.filter((adminId) => adminId !== userId)
          : [...groupChat.admins, userId];

        return { ...groupChat, admins: newAdmins };
      });
      return { ...prevData, data: updatedData };
    });
  });
}
