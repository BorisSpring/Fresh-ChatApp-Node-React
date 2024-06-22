import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { MdOutlineGroupAdd } from 'react-icons/md';
import { CircleLoader } from 'react-spinners';
import { useQueryClient } from '@tanstack/react-query';

// components
import GroupChatForm from '../components/GroupChatForm';
import GroupChatInfo from '../components/GroupChatInfo';

// custom hook
import { useGetGroupChats } from '../hooks/chats/useGetGroupChats';

// context
import { useSelectedChatContext } from '../context/useSelectChatContext';
import { useSocketContext } from '../context/useSocketContext';

const LeftSideGroup = () => {
  const [isAddGroup, setIsAddGroup] = useState(false);
  // context
  const { setSelectedChat } = useSelectedChatContext();
  const socket = useSocketContext();

  // react query
  const { groupChats, isLoading } = useGetGroupChats();
  const queryClient = useQueryClient();

  // toggle form function for creating group chat
  const toggleIsAddGroup = () => setIsAddGroup((prev) => !prev);
  return (
    <>
      <section className='pt-4 bg-gray-50 overflow-y-auto  dark:bg-[#36404a]  h-full flex flex-col gap-3 md:gap-5 w-full lg:max-w-[390px]'>
        <div className='px-4 flex items-center gap-3 justify-between mb-10'>
          <h3 className='font-bold text-xl text-gray-600 dark:text-[#eff2f7]'>
            Group Chats
          </h3>
          <button
            className='outline-none border-none text-lg dark:hover:bg-gray-600 dark:p-1 dark:rounded-md transition-all duration-300'
            onClick={toggleIsAddGroup}
          >
            <MdOutlineGroupAdd className='text-gray-600 dark:text-[#eff2f7] ' />
          </button>
        </div>

        <div>
          {/* displaying group chats */}
          {isLoading ? (
            <CircleLoader color='#7269ef' className='m-auto mt-[100px]' />
          ) : (
            groupChats?.data?.map((groupChat, i) => (
              <GroupChatInfo
                queryClient={queryClient}
                socket={socket}
                key={i}
                {...groupChat}
                setSelectedChat={setSelectedChat}
              />
            ))
          )}
        </div>
      </section>

      {/* displaying grup chat form if settings is active (true) */}
      <AnimatePresence>
        {isAddGroup && <GroupChatForm toggleIsAddGroup={toggleIsAddGroup} />}
      </AnimatePresence>
    </>
  );
};

export default LeftSideGroup;
