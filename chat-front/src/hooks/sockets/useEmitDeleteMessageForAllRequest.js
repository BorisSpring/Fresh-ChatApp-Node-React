import { useSelectedChatContext } from '../../context/useSelectChatContext';
import { useSocketContext } from '../../context/useSocketContext';

export function useEmitDeleteMessageForAll() {
  const socket = useSocketContext();
  const { selectedChat } = useSelectedChatContext();

  const emitDeleteMessageForAll = (messageId) => {
    socket.emit('deleteMessageForAllRequest', {
      messageId: messageId,
      isGroup: selectedChat.isGroup,
    });
  };

  return emitDeleteMessageForAll;
}
