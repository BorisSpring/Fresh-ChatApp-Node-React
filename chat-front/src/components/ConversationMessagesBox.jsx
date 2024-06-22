import React, { useEffect, useRef } from 'react';
import { CircleLoader } from 'react-spinners';
import Message from './Message';

// custom hooks
import { useEmitDeleteMessageMeRequest } from '../hooks/sockets/useEmitDeleteMessageMeRequest';
import { useEmitDeleteMessageForAll } from '../hooks/sockets/useEmitDeleteMessageForAllRequest';
import { useGetChatMessages } from '../hooks/chats/useGetChatMessages';
import { useGetLoggedUser } from '../hooks/users/useGetLoggedUser';
import { useSelectedChatContext } from '../context/useSelectChatContext';

const ConversationMessagesBox = () => {
  const {
    chatMessages,
    isLoadingChatMessages,
    fetchNextChatMessagesPage,
    isFetchingNextPage,
  } = useGetChatMessages();

  const { selectedChat } = useSelectedChatContext();
  const { loggedUser } = useGetLoggedUser();

  const topMessageBoxRef = useRef(null);
  const messageRef = useRef(null);
  const previousScrollHeightRef = useRef(0);

  // socket hooks for emiting event
  const emitDeleteMessageMeRequest = useEmitDeleteMessageMeRequest();
  const emitDeleteMessageForAll = useEmitDeleteMessageForAll();

  useEffect(() => {
    const currentTopMessageBoxRef = topMessageBoxRef.current;

    const handleScroll = async () => {
      const { scrollTop, scrollHeight } = currentTopMessageBoxRef;
      if (scrollTop < 200 && !isFetchingNextPage) {
        previousScrollHeightRef.current = scrollHeight;
        fetchNextChatMessagesPage();
      }
    };

    const adjustScrollPosition = () => {
      const { scrollHeight } = currentTopMessageBoxRef;
      const newScrollHeight = scrollHeight;
      const oldScrollHeight = previousScrollHeightRef.current;
      currentTopMessageBoxRef.scrollTop += newScrollHeight - oldScrollHeight;
    };

    adjustScrollPosition();

    if (currentTopMessageBoxRef) {
      currentTopMessageBoxRef.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (currentTopMessageBoxRef) {
        currentTopMessageBoxRef.removeEventListener('scroll', handleScroll);
      }
    };
  }, [chatMessages?.pages, fetchNextChatMessagesPage, isFetchingNextPage]);

  // scorll to first message
  useEffect(() => {
    if (messageRef.current && chatMessages?.pages.length <= 1) {
      messageRef.current.scrollIntoView();
    }
  }, [isLoadingChatMessages, chatMessages]);

  return (
    <div
      ref={topMessageBoxRef}
      className='dark:bg-[#262e35]  bg-white w-full h-chat-height lg:h-chat-lg  overflow-y-auto flex flex-col gap-2 md:gap-3'
    >
      {isLoadingChatMessages && (
        <CircleLoader color='#7269ef' className='m-auto' />
      )}

      {chatMessages?.pages &&
        chatMessages.pages
          .slice()
          .reverse()
          .map((page) =>
            [...page.messages]
              .reverse()
              .map((message) => (
                <Message
                  selectedChat={selectedChat}
                  key={message.id}
                  emitDeleteMessageForAll={emitDeleteMessageForAll}
                  emitDeleteMessageMeRequest={emitDeleteMessageMeRequest}
                  {...message}
                  loggedUser={loggedUser}
                />
              ))
          )}
      <div ref={messageRef}></div>
    </div>
  );
};

export default ConversationMessagesBox;
