import toast from 'react-hot-toast';

export const onChatDeleted = (socket, queryClient, setSelectedChat) => {
  socket.on('chatDeleted', (eventDetails) => {
    const { chatId } = eventDetails;
    setSelectedChat(() => {});
    updateRecentChats(queryClient, chatId);
    removeChatFromQueryCash(queryClient, chatId);
    toast.success('Chat has been deleted successfully');
  });
};

const updateRecentChats = (queryClient, chatId) => {
  queryClient.setQueryData(['chats'], (prevData) => {
    if (!prevData) return;
    let isFiltered = false;

    let updatedPages = prevData.pages.map((page, i) => {
      // filter single chat
      const updatedData = page.data.filter((chat) => {
        if (chat._id === chatId) {
          isFiltered = true;
          return false;
        } else {
          return true;
        }
      });

      if (isFiltered) {
        // find next page
        const nextPage = prevData.pages[i + 1];
        return {
          ...page,
          data:
            nextPage && nextPage?.data?.length > 0
              ? [...updatedData, nextPage.data.shift()]
              : updatedData,
        };
      }
      // return filtered chat if there is no next page
      return { ...page, data: updatedData };
    });

    // update pages with new chat data
    return { ...prevData, pages: updatedPages };
  });
};

const removeChatFromQueryCash = (queryClient, chatId) => {
  queryClient.removeQueries(['chat', chatId]);
};
