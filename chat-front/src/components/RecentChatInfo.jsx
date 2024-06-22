import React, { memo } from 'react';
import { FaCheck } from 'react-icons/fa';

// utils
import {
  getImageUrl,
  formatDateUtils,
  cn,
  updateChatNotificationAndEmitSeenMessages,
} from '../utils/utils.js';

const RecentChatInfo = memo(function RecentChatInfo({
  setSelectedChat,
  participants,
  isGroup,
  message,
  _id,
  unreadedMessages,
  queryClient,
  socket,
  loggedUser,
}) {
  const {
    message: textMessage,
    imageUrl,
    fileUrl,
    createdAt,
    seenBy,
    senderId,
  } = message[0] ?? {};

  const {
    name,
    lastName,
    status,
    _id: participantId,
    image,
  } = participants?.[0];
  return (
    <div
      onClick={() => {
        unreadedMessages > 0 &&
          updateChatNotificationAndEmitSeenMessages(
            _id,
            false,
            queryClient,
            socket
          );

        setSelectedChat(() => ({
          id: _id,
          name,
          lastName,
          status,
          participantId,
          isGroup,
          image,
        }));
      }}
      className='flex px-4 dark:bg-gray-700 dark:border-b-gray-600 cursor-pointer justify-between gap-2 border-b border-gray-200 overflow-hidden  hover:bg-gray-100 bg-gray-50 p-2 items-center'
    >
      <div className='relative min-w-9 min-h-9 '>
        <img
          src={getImageUrl(image)}
          alt='user avatar'
          className='w-9 h-9 rounded-full'
        />
        <div
          className={cn(
            'w-[10px] h-[10px] rounded-full absolute bottom-0 border-2 border-white right-0',
            {
              'bg-[#06d6a0]': status === 'active',
              'bg-gray-100': !status || status === 'offline',
              'bg-yellow-400': status === 'busy',
            }
          )}
        ></div>
      </div>
      <div className='flex flex-col  min-h-[37.5px]  w-full'>
        <h6 className='font-semibold dark:text-[#eff2f7] text-[13px] md:text-[15px] text-gray-600'>
          {name} {lastName}
        </h6>
        <p className='text-[12px] md:text-[13px] dark:text-[#abb4d2] max-w-[240px] lg:max-w-[256px] text-ellipsis line-clamp-1   overflow-hidden text-gray-500'>
          {textMessage}
          {imageUrl && 'Image Message'}
          {fileUrl && 'File Message'}
        </p>
      </div>
      <div className='flex flex-col items-end gap-1'>
        <p className='whitespace-nowrap  dark:text-[#abb4d2] text-gray-500 text-[14px]'>
          {formatDateUtils(createdAt)}
        </p>
        <div className='flex items-center gap-2'>
          {(senderId === loggedUser?.user?.id || !senderId) && (
            <div className='flex items-center'>
              <FaCheck
                className={cn('text-xs dark:text-[#abb4d2] text-gray-500', {
                  'text-purple dark:text-lightestPurple': seenBy?.length > 0,
                })}
              />
              <FaCheck
                className={cn('text-xs dark:text-[#abb4d2] text-gray-500', {
                  'text-purple dark:text-lightestPurple': seenBy?.length > 0,
                })}
              />
            </div>
          )}
          {unreadedMessages > 0 && (
            <p className='w-5 bg-purple text-xs font-bold rounded-lg flex items-center justify-center  text-white'>
              {unreadedMessages}
            </p>
          )}
        </div>
      </div>
    </div>
  );
});

export default RecentChatInfo;
