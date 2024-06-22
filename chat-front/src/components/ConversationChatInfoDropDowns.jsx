import React, { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

// icons
import { BsThreeDots } from 'react-icons/bs';
import { IoIosSearch, IoMdExit } from 'react-icons/io';
import { MdDelete, MdRemove, MdSettings, MdWarning } from 'react-icons/md';

// custom hooks
import useDetectClickOutside from '../hooks/universal/useDetectClickOutside';
import { useEmitDeleteChat } from '../hooks/sockets/useEmitDeleteChat';
import { useEmitLeaveGroupChat } from '../hooks/sockets/useEmitLeaveGroupChat';

// utils
import { cn } from '../utils/utils';

// context
import { useSelectedChatContext } from '../context/useSelectChatContext';
import { useGetLoggedUser } from '../hooks/users/useGetLoggedUser';

// compponents
import SingleGroupChatInfo from './SingleGroupChatInfo';
import { Socket } from 'socket.io-client';
import { useSocketContext } from '../context/useSocketContext';

const ConversationChatInfoDropDowns = () => {
  const ref = useRef(null);
  const actionRef = useRef(null);
  const searchRef = useRef(null);

  const { loggedUser } = useGetLoggedUser();

  // context
  const { selectedChat } = useSelectedChatContext();
  const socket = useSocketContext();

  // component state
  const [settings, setSettings] = useState({
    isOpen: false,
    action: '',
  });
  const { isOpen, action } = settings;

  // deteck click outside for refs
  useDetectClickOutside(
    ref,
    () => setSettings(() => ({ action: '', isOpen: false })),
    [actionRef, searchRef]
  );

  // toggling state function
  const toogleSettings = (type) =>
    setSettings((prev) => ({
      isOpen: prev.action !== type || !prev.isOpen,
      action: type,
    }));

  // socket function for emtiing delete chat
  const emitDeleteChat = useEmitDeleteChat();
  const emitLeaveGroupChat = useEmitLeaveGroupChat();

  return (
    <>
      <div className='flex items-center gap-3 lg:text-[20px] text-gray-600 text-base md:text-lg relative '>
        {/* toggling search */}
        <button
          ref={searchRef}
          onClick={() => toogleSettings('search')}
          className='relative dark:text-[#eff2f7] outline-none border-none w-7 h-7 flex items-center justify-center rounded-md dark:hover:bg-gray-700 hover:bg-gray-100'
        >
          <IoIosSearch />
        </button>

        {/* search input */}
        {isOpen && action === 'search' && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            ref={ref}
            className={cn(
              'absolute z-[99999] dark:bg-gray-700 dark:border-none  bg-white shadow-md px-3 py-2 border rounded-md -bottom-[41px] right-[57px]'
            )}
          >
            <input
              className='outline-none px-2 text-sm py-1 dark:text-[#eff2f7] dark:bg-gray-600  bg-gray-100 rounded-sm'
              placeholder='Search for text'
              type='text'
            />
          </motion.div>
        )}

        {/* actions toggle */}
        <button
          ref={actionRef}
          onClick={() => toogleSettings('actions')}
          className='dark:text-[#eff2f7] outline-none dark:hover:bg-gray-700 relative border-none w-7 h-7 flex items-center justify-center rounded-md hover:bg-gray-100'
        >
          <BsThreeDots />
        </button>

        {/* dropdown actions */}
        {isOpen && action === 'actions' && (
          <motion.ul
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            ref={ref}
            className={cn(
              'absolute z-40 dark:bg-gray-700 cursor-pointer rounded-md  dark:border-none bg-white text-base shadow-md text-gray-600 font-medium  border-gray-200 border top-9 right-0',
              {
                '': isOpen && action === 'actions',
              }
            )}
          >
            {!selectedChat?.isGroup && (
              <li
                onClick={() => emitDeleteChat(selectedChat?.id)}
                className={cn(
                  'flex items-center  px-4 hover:bg-gray-200 dark:text-[#eff2f7] dark:hover:bg-gray-800  transition-all duration-400  py-[6px] gap-3 justify-between ',
                  { 'hidden ': !selectedChat?.id }
                )}
              >
                Delete
                <MdDelete className='text-red-700' />
              </li>
            )}
            {selectedChat?.createdBy === loggedUser.user.id && (
              <li
                onClick={() =>
                  socket.emit('deleteGroupChat', { chatId: selectedChat.id })
                }
                className={cn(
                  'flex items-center  whitespace-nowrap px-4 hover:bg-gray-200 dark:text-[#eff2f7] dark:hover:bg-gray-800  transition-all duration-400  py-[6px] gap-3 justify-between ',
                  { 'hidden ': !selectedChat?.id }
                )}
              >
                Delete Chat
                <MdRemove className='text-white' />
              </li>
            )}
            {selectedChat?.isGroup && (
              <li
                onClick={() => toogleSettings('info')}
                className={cn(
                  'flex items-center  whitespace-nowrap px-4 hover:bg-gray-200 dark:text-[#eff2f7] dark:hover:bg-gray-800  transition-all duration-400  py-[6px] gap-3 justify-between ',
                  { 'hidden ': !selectedChat?.id }
                )}
              >
                Chat Info
                <MdSettings className='text-white' />
              </li>
            )}
            {selectedChat?.isGroup &&
              loggedUser.user.id !== selectedChat?.createdBy && (
                <li
                  onClick={() => emitLeaveGroupChat(selectedChat?.id)}
                  className={cn(
                    'flex items-center  px-4 hover:bg-gray-200 dark:text-[#eff2f7] dark:hover:bg-gray-800  transition-all duration-400  py-[6px] gap-3 justify-between ',
                    { 'hidden ': !selectedChat?.id }
                  )}
                >
                  Leave
                  <IoMdExit className='text-red-700 text-lg' />
                </li>
              )}
            <li className='flex items-center px-4 dark:text-[#eff2f7] dark:hover:bg-gray-800  hover:bg-gray-200 transition-all duration-400 py-[6px]  gap-3 justify-between '>
              Report <MdWarning className='text-yellow-500' />
            </li>
          </motion.ul>
        )}
      </div>
      <AnimatePresence>
        {action === 'info' && (
          <SingleGroupChatInfo toogleSettings={toogleSettings} />
        )}
      </AnimatePresence>
    </>
  );
};

export default ConversationChatInfoDropDowns;
