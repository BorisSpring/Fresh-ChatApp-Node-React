import React from 'react';
import { FaChevronLeft } from 'react-icons/fa';

// components
import ConversationChatInfoDropDowns from './ConversationChatInfoDropDowns';

// custom hooks
import { useSelectedChatContext } from '../context/useSelectChatContext';

// utils
import { cn, getImageUrl } from '../utils/utils';

const ConversationChatInfo = () => {
  const { selectedChat, setSelectedChat } = useSelectedChatContext();

  const { chatName, name, lastName, status, isGroup, image } =
    selectedChat ?? {};

  return (
    <div className='flex justify-between p-2  md:p-3 lg:p-3 dark:border-b-gray-700 dark:border-b-2 relative px-2 md:px-4  md:py-2 w-full border-b'>
      {/* user info */}
      <div className='flex items-center justify-center gap-2'>
        {/* mobile button for closing chat */}
        <FaChevronLeft
          cursor='pointer'
          className='text-gray-600 mr-2 lg:hidden'
          onClick={() => setSelectedChat(() => null)}
        />

        {/* user photo or group chat info */}
        {!isGroup ? (
          <img
            src={getImageUrl(image)}
            alt='user avatar'
            className='w-9 h-9 rounded-full'
          />
        ) : (
          <div className='w-10 h-10 bg-purple shadow-md rounded-full flex items-center justify-center'>
            <p className='uppercase font-bold dark:text-[#eff2f7] text-white'>
              {chatName?.charAt?.(0)}
            </p>
          </div>
        )}

        {/* if signle chat displaying user name and last name otherwise group chat name */}
        <p className='font-semibold dark:text-[#eff2f7] text-gray-700 tracking-wider'>
          {name} {lastName} {chatName}
        </p>

        {/* status */}
        {!isGroup && (
          <div
            className={cn(
              'relative w-[10px] h-[10px]  rounded-full bg-[#06d6a0]',
              {
                'bg-gray-600': status === 'offline',
                'bg-yellow-400': status === 'busy',
              }
            )}
          >
            <div className='absolute w-1 h-1 bg-white rounded-full top-[50%] left-[50%] -translate-y-1/2 -translate-x-1/2'></div>
          </div>
        )}
      </div>
      <ConversationChatInfoDropDowns />
    </div>
  );
};

export default ConversationChatInfo;
