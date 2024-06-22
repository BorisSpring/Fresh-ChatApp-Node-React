export function onNewGroupChat(socket, queryClient) {
  socket.on('newGroupChat', (eventDetails) => {
    queryClient.setQueryData(['groupChats'], (prevData) => {
      if (!prevData) return;
      return {
        ...prevData,
        data: [
          {
            ...eventDetails,
            participants: eventDetails.participants.map((participant) => ({
              ...participant,
              _id: participant.id,
            })),
          },
          ...prevData?.data,
        ],
      };
    });
  });
}
