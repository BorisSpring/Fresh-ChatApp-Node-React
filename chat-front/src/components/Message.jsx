import React, { memo, useState } from 'react';
import { format } from 'date-fns';
import { FaCheck } from 'react-icons/fa';

// components
import MessageActionDropdown from './MessageActionDropdown';
import MessageFileBox from './MessageFileBox';
import MessageImageBox from './MessageImageBox';

// utils
import { cn, getImageUrl } from '../utils/utils';

const Message = memo(function Message({
  emitDeleteMessageForAll,
  emitDeleteMessageMeRequest,
  chatId,
  senderId,
  message,
  imageUrl,
  fileUrl,
  isDeleted,
  createdAt,
  id,
  loggedUser,
  seenBy,
  selectedChat,
}) {
  const [showSeenBy, setShowSeenBy] = useState(false);

  return (
    <div
      className={cn('flex  py-2 px-5 gap-2 ', {
        'justify-start ml-auto': !senderId,
        'justify-start items-end': !!senderId,
      })}
    >
      {/* logged user image */}
      {senderId?.image && (
        <img
          src={getImageUrl(senderId.image)}
          alt='user avatar'
          className='w-9 h-9 rounded-full'
        />
      )}

      {/* message info */}
      <div>
        <div
          className={cn('p-3 rounded-md text-sm relative ', {
            'text-white  bg-purple rounded-bl-none': !!senderId,
            'bg-gray-100 text-gray-700 dark:text-[#eff2f7] rounded-br-none dark:bg-[#36404a]':
              !senderId,
          })}
        >
          {/* file message box */}
          {fileUrl && <MessageFileBox fileName={fileUrl} id={id} />}

          {/* image message box */}
          {imageUrl && <MessageImageBox imageUrl={imageUrl} id={id} />}

          {/* message text */}
          {message && (
            <p className='break-words max-w-[250px] sm:max-w-[400px] md:max-w-[600px]'>
              {message}
            </p>
          )}

          {/* message created at and seen status */}
          <div className='flex items-center gap-2'>
            {!senderId && !selectedChat?.isGroup && (
              <div className='flex items-center'>
                <FaCheck
                  className={cn(
                    'text-[9px] dark:text-lightPurple text-gray-400',
                    {
                      'text-darkPurple': seenBy?.length > 0,
                    }
                  )}
                />
                <FaCheck
                  className={cn(
                    'text-[9px] dark:text-lightPurple text-gray-400',
                    {
                      'text-darkPurple': seenBy?.length > 0,
                    }
                  )}
                />
              </div>
            )}

            {/* group chat seen by */}
            {seenBy?.length > 0 && !showSeenBy && selectedChat.isGroup && (
              <div className='text-gray-500 text-xs dark:text-gray-300'>
                {seenBy.length} participants viewed message{' '}
                <button
                  className='outline-none font-semibold  border-none text-purple dark:text-lightPurple text-sm'
                  onClick={() => setShowSeenBy((prev) => !prev)}
                >
                  Show Info
                </button>
              </div>
            )}

            {/* group chat seen by */}
            {seenBy?.length > 0 && showSeenBy && selectedChat.isGroup && (
              <div className='text-gray-500 text-xs dark:text-gray-300'>
                Seen By{' '}
                {seenBy.map(({ userId }, index) => {
                  const userInfo = selectedChat.participants.find(
                    (participant) => participant._id === userId
                  );

                  return `${userInfo?.name} ${userInfo?.lastName}${
                    index < seenBy.length - 1 ? ',' : ''
                  } `;
                })}
                <button
                  className='outline-none font-semibold  border-none text-purple dark:text-lightPurple text-sm'
                  onClick={() => setShowSeenBy((prev) => !prev)}
                >
                  Hide Info
                </button>
              </div>
            )}

            <p
              className={cn(
                'text-xs w-fit whitespace-nowrap dark:text-[#eff2f7] text-gray-200 mt-1 ',
                {
                  ' ml-auto': !!senderId,
                  'mr-auto text-gray-600': !senderId,
                }
              )}
            >
              {format(createdAt, 'h:mm a')}
            </p>
          </div>

          {/* dropdown trigger  actions */}
          <MessageActionDropdown
            message={message}
            emitDeleteMessageForAll={emitDeleteMessageForAll}
            emitDeleteMessageMeRequest={emitDeleteMessageMeRequest}
            chatId={chatId}
            id={id}
            senderId={senderId}
            isDeleted={isDeleted}
          />
        </div>

        {/* clip path for messages box */}
        <div
          className={cn('clip-path-first w-10 h-2 md:h-3', {
            'clip-path-second bg-purple': !!senderId,
            'clip-path-first bg-gray-100 dark:bg-[#36404a] ml-auto': !senderId,
          })}
        />

        {/* user full name */}
        <p
          className={cn(
            'text-[12px]  dark:text-[#eff2f7] text-gray-600  w-fit',
            {
              'ml-auto  ': !senderId,
            }
          )}
        >
          {senderId
            ? `${senderId.name} ${senderId.lastName}`
            : `${loggedUser?.user?.name} ${loggedUser?.user?.lastName}`}
        </p>
      </div>

      {/* other user image */}
      {!senderId && (
        <img
          src={getImageUrl(loggedUser?.user?.image)}
          alt='user avatar'
          className='w-9 h-9 rounded-full mt-auto'
        />
      )}
    </div>
  );
});

export default Message;
