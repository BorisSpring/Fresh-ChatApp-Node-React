import { useQuery } from '@tanstack/react-query';
import { searchUserApi } from '../../api/actions';

import { useSearchContext } from '../../context/useSearchContext';

export function useSearchUser() {
  const { query } = useSearchContext();
  const { data: searchUsers, isLoading: isLoadingSearchedUsers } = useQuery({
    queryFn: () => searchUserApi(query),
    queryKey: ['searchedUsers', query],
    enabled: query?.trim()?.length > 0,
  });

  return { searchUsers, isLoadingSearchedUsers };
}
