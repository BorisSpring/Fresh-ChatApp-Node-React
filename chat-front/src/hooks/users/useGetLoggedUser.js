import { useQuery } from '@tanstack/react-query';
import { getLoggedUserApi } from '../../api/actions';

export function useGetLoggedUser() {
  const { data: loggedUser, isLoading } = useQuery({
    queryFn: getLoggedUserApi,
    queryKey: ['loggedUser'],
    enabled: !!localStorage.getItem('jwt'),
  });

  return { loggedUser, isLoading };
}
