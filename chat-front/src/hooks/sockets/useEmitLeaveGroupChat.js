import { useSocketContext } from '../../context/useSocketContext';

export function useEmitLeaveGroupChat() {
  const socket = useSocketContext();

  const emitLeaveGroupChat = (chatId) => {
    socket.emit('leaveGroupChat', { chatId: chatId });
  };

  return emitLeaveGroupChat;
}
