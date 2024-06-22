import { useSocketContext } from '../../context/useSocketContext';

export function useEmitDeleteMessageMeRequest() {
  const socket = useSocketContext();

  const emitDeleteMessageMeRequest = (messageId) => {
    socket.emit('deleteMessageMeRequest', { messageId: messageId });
  };

  return emitDeleteMessageMeRequest;
}
