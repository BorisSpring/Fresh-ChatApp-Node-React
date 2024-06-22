import { useInfiniteQuery } from '@tanstack/react-query';
import { getChatMessages } from '../../api/actions';
import { useSelectedChatContext } from '../../context/useSelectChatContext';

export function useGetChatMessages() {
  const { selectedChat } = useSelectedChatContext();

  const {
    data: chatMessages,
    fetchNextPage,
    hasNextPage,
    isFetching: isLoadingChatMessages,
    isFetchingNextPage,
    isError,
    refetch,
  } = useInfiniteQuery({
    queryKey: ['chat', selectedChat?.id],
    initialPageParam: 1,
    enabled: !!selectedChat?.id,
    queryFn: ({ pageParam }) =>
      getChatMessages({ pageParam: pageParam, chatId: selectedChat.id }),
    getNextPageParam: (lastPage, pages) => lastPage?.nextPage ?? undefined,
  });

  const fetchNextChatMessagesPage = () => {
    if (!isFetchingNextPage && hasNextPage) {
      if (
        chatMessages.pages[chatMessages.pages.length - 1].messages.length <
          20 &&
        chatMessages.pages[chatMessages.pages.length - 1].hasMore
      ) {
        refetch({
          refetchPage: (page, index) => index === chatMessages.pages.length,
        });
      } else {
        fetchNextPage();
      }
    }
  };

  return {
    chatMessages,
    isLoadingChatMessages,
    fetchNextChatMessagesPage,
    hasNextPage,
    isFetchingNextPage,
    isError,
    fetchNextPage,
  };
}
