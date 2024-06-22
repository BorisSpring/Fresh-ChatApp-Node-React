import { useInfiniteQuery } from '@tanstack/react-query';
import { getUserChatsApi } from '../../api/actions';

export function useGetUserChats() {
  const {
    data: userChats,
    isFetching: isLoadingChats,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    initialPageParam: 1,
    queryKey: ['chats'],
    queryFn: ({ pageParam }) => getUserChatsApi(pageParam),
    getNextPageParam: (lastPage, pages) => lastPage.nextPage ?? undefined,
  });

  const fetchMoreChats = () => {
    if (!isLoadingChats || !isFetchingNextPage) fetchNextPage();
  };

  return { userChats, isLoadingChats, fetchMoreChats, isFetchingNextPage };
}
