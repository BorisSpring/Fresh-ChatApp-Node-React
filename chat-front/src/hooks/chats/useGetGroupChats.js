import { useQuery } from '@tanstack/react-query';
import { getGroupChatsApi } from '../../api/actions';

export function useGetGroupChats() {
  const { data: groupChats, isLoading } = useQuery({
    queryFn: getGroupChatsApi,
    queryKey: ['groupChats'],
  });
  return { groupChats, isLoading };
}
