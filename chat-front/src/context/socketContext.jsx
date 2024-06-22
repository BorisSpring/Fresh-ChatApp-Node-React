import { useQueryClient } from '@tanstack/react-query';
import { createContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';

// context
import { useSelectedChatContext } from './useSelectChatContext';

// custom hooks and event handlers for socket
import { onUserStatus } from '../hooks/sockets/onUserStatus';
import { onNewMessage } from '../hooks/sockets/onNewMessage';
import { onError } from '../hooks/sockets/onError';
import { onDeletedMessageForRequestUserResponse } from '../hooks/sockets/onDeletedMessageForRequestUserResponse';
import { onDeleteMessageForAllResponse } from '../hooks/sockets/onDeleteMessageForAllResponse';
import { onChatDeleted } from '../hooks/sockets/onChatDeleted';
import { onNewGroupChat } from '../hooks/sockets/onNewGroupChat';
import { onSeenChatMessages } from '../hooks/sockets/onSeenChatMessages';
import { onHandleLeavedGroupChat } from '../hooks/sockets/onHandleLeavedGroupChat';
import { onHandleGrantOrRevokeInfo } from '../hooks/sockets/onHandleGrantOrRevokeInfo';
import { onHandleKickedUserFromChat } from '../hooks/sockets/onHandleKickedUserFromChat';
import { onHandleAddedUserToGroupChat } from '../hooks/sockets/onHandleAddedUserToGroupChat';
import { onHandleKickedFromChat } from '../hooks/sockets/onHandleKickedFromChat';
import { onHandleGroupChatDeleted } from '../hooks/sockets/onHandleGroupChatDeleted';

const SocketContext = createContext();

const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const queryClient = useQueryClient();
  const { setSelectedChat, selectedChat } = useSelectedChatContext();
  const navigate = useNavigate();
  const jwtToken = localStorage.getItem('jwt');

  useEffect(() => {
    if (!jwtToken) return;
    // eslint-disable-next-line no-undef
    let newSocket = io(process.env.BACKEND_URL, {
      path: '/socket',
      extraHeaders: {
        Authorization: `Bearer ${localStorage.getItem('jwt')}`,
      },
    });
    setSocket(() => newSocket);

    return () => {
      if (newSocket) newSocket.disconnect();
    };
  }, [jwtToken]);

  useEffect(() => {
    if (socket) {
      //  handling user status chaning!
      onUserStatus(socket, queryClient, setSelectedChat, selectedChat);
      // when receiving messages from other user
      onNewMessage(socket, queryClient, setSelectedChat, selectedChat);
      // on handling user delete message for him only
      onDeletedMessageForRequestUserResponse(socket, queryClient);
      // on handlign user delete hes message for all users in chat
      onDeleteMessageForAllResponse(socket, queryClient);
      // on handling user delete chat
      onChatDeleted(socket, queryClient, setSelectedChat);
      // on handling new group chat
      onNewGroupChat(socket, queryClient);
      // on handling seen chat messages
      onSeenChatMessages(socket, queryClient);
      // on handling leaved group chat
      onHandleLeavedGroupChat(socket, queryClient, setSelectedChat);
      // on handling grant or revoke info
      onHandleGrantOrRevokeInfo(
        socket,
        queryClient,
        selectedChat,
        setSelectedChat
      );
      // on handling kicked user from chat
      onHandleKickedUserFromChat(
        socket,
        queryClient,
        selectedChat,
        setSelectedChat
      );
      // on handling updating group chat for added users
      onHandleAddedUserToGroupChat(
        socket,
        queryClient,
        selectedChat,
        setSelectedChat
      );
      // on handling removed from chat
      onHandleKickedFromChat(
        socket,
        queryClient,
        selectedChat,
        setSelectedChat
      );

      onHandleGroupChatDeleted(
        socket,
        queryClient,
        selectedChat,
        setSelectedChat
      );

      // on handling errors
      onError(socket, navigate);

      return () => {
        socket.off('userStatus');
        socket.off('newMessage');
        socket.off('deletedMessageForRequestUserResponse');
        socket.off('deleteMessageForAllResponse');
        socket.off('chatDeleted');
        socket.off('newGroupChat');
        socket.off('seenMessages');
        socket.off('error');
        socket.off('grantOrRevokeInfo');
        socket.off('kickedUserFromChat');
        socket.off('addedUserToGroupChat');
        socket.off('kickedFromChat');
        socket.off('groupChatDeleted');
      };
    }
  }, [socket, setSelectedChat, queryClient, navigate, selectedChat]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export { SocketContext };
export default SocketContextProvider;
