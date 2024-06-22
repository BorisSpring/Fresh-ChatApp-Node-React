import React, { useEffect, useRef } from 'react';
import RecentChatInfo from './RecentChatInfo';
import { CircleLoader } from 'react-spinners';
import { useQueryClient } from '@tanstack/react-query';

// custom hooks
import { useGetUserChats } from '../hooks/chats/useGetUserChats';

// context
import { useSelectedChatContext } from '../context/useSelectChatContext';
import { useSocketContext } from '../context/useSocketContext';
import { useGetLoggedUser } from '../hooks/users/useGetLoggedUser';

const RecentChats = () => {
  // context
  const { setSelectedChat } = useSelectedChatContext();
  const socket = useSocketContext();

  // fetch chats use infinite hook
  const { userChats, isLoadingChats, fetchMoreChats, isFetchingNextPage } =
    useGetUserChats();
  const { loggedUser } = useGetLoggedUser();
  const queryClient = useQueryClient();

  // refss
  const recentChatsRef = useRef(null);
  const previousScrollHeight = useRef(0);

  useEffect(() => {
    const recentChatsRefCurrent = recentChatsRef.current;

    const handleScroll = () => {
      const { scrollHeight, scrollTop } = recentChatsRefCurrent;
      if (scrollTop === scrollHeight) {
        previousScrollHeight.current = scrollHeight;
        fetchMoreChats();
      }
    };

    const adjustScrollPositionAffterFetchMoreData = () => {
      recentChatsRef.current.scrollTop = previousScrollHeight;
    };
    adjustScrollPositionAffterFetchMoreData();

    recentChatsRefCurrent && window.addEventListener('scroll', handleScroll);

    return () => {
      recentChatsRefCurrent &&
        window.removeEventListener('scroll', handleScroll);
    };
  }, [fetchMoreChats, userChats?.pages]);

  return (
    <>
      <h3 className='font-bold px-4 dark:text-[#eff2f7] text-base md:text-lg text-gray-600'>
        Recent
      </h3>
      <div
        ref={recentChatsRef}
        className='h-full overflow-y-auto w-full   -mt-3 mb-1'
      >
        {/* displaying loader if loading user chats */}
        {isLoadingChats && (
          <CircleLoader color='#7269ef' className='m-auto mt-[100px]' />
        )}

        {/* dispalying user recent chats */}
        {userChats?.pages?.map?.((page) =>
          page?.data?.map?.((chat) => (
            <RecentChatInfo
              loggedUser={loggedUser}
              socket={socket}
              queryClient={queryClient}
              setSelectedChat={setSelectedChat}
              {...chat}
              key={chat._id}
            />
          ))
        )}
        {isFetchingNextPage && (
          <CircleLoader color='#7269ef' className='m-auto' />
        )}
      </div>
    </>
  );
};

export default RecentChats;
