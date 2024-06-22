import React, { memo } from 'react';

const GroupChatInfo = memo(function GroupChatInfo({
  chatName,
  _id,
  setSelectedChat,
  unreadedMessages,
  queryClient,
  socket,
  createdBy,
  participants,
  admins,
}) {
  return (
    <div
      onClick={() => {
        if (unreadedMessages > 0) {
          queryClient.setQueryData(['groupChats'], (prevData) => {
            if (!prevData) return;
            return {
              ...prevData,
              data: prevData.data.map((groupChat) =>
                groupChat._id === _id
                  ? { ...groupChat, unreadedMessages: 0 }
                  : groupChat
              ),
            };
          });
          socket.emit('openChat', { isGroup: true, id: _id });
        }
        setSelectedChat(() => ({
          id: _id,
          isGroup: true,
          chatName,
          createdBy,
          participants,
          admins,
        }));
      }}
      className='flex dark:bg-gray-700 dark:hover:bg-gray-800 dark:border-b-gray-600  justify-between px-4 cursor-pointer overflow-hidden border-b border-gray-200  hover:bg-gray-100 bg-gray-50 p-2 items-center'
    >
      <div className='flex items-center gap-2'>
        <div className='w-10 h-10 bg-purple dark:bg-lightestPurple shadow-md rounded-full flex items-center justify-center'>
          <p className='uppercase font-bold text-white dark:text-[#eff2f7]'>
            {chatName?.charAt(0)}
          </p>
        </div>
        <p className='font-medium text-gray-600 dark:text-[#eff2f7]'>
          #{chatName}
        </p>
      </div>
      {unreadedMessages > 0 && (
        <p className='w-5 bg-purple text-xs dark:text-[#eff2f7] font-bold rounded-lg flex items-center justify-center  text-white'>
          {unreadedMessages}
        </p>
      )}
    </div>
  );
});

export default GroupChatInfo;
