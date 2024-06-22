import { useSocketContext } from '../../context/useSocketContext';

export function useEmitDeleteChat() {
  const socket = useSocketContext();

  const emitDeleteChat = (chatId) => {
    socket.emit('deleteChat', { chatId: chatId });
  };

  return emitDeleteChat;
}
