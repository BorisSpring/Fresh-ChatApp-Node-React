import { useQueryClient } from '@tanstack/react-query';
import { useSocketContext } from '../../context/useSocketContext';
import { useGetLoggedUser } from '../users/useGetLoggedUser';

export function useEmitChangeStatus() {
  const queryClient = useQueryClient();
  const socket = useSocketContext();
  const { loggedUser } = useGetLoggedUser();

  const onHandleEditStatus = (status) => {
    socket.emit('changeStatus', { userId: loggedUser.user.id, status: status });
    if (status === 'busy' || status === 'active') {
      handleBusyAndActiveStatus(queryClient, status);
    } else if (status === 'offline') {
      queryClient.removeQueries(['loggedUser']);
    }
  };
  return onHandleEditStatus;
}

const handleBusyAndActiveStatus = (queryClient, status) => {
  queryClient.setQueryData(['loggedUser'], (prevData) => {
    if (!prevData && !prevData.user) return prevData;
    const updatedUser = {
      ...prevData.user,
      status: status,
    };
    return { ...prevData, user: updatedUser };
  });
};
