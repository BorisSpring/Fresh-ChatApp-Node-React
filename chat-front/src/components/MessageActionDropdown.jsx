import React, { useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import { HiOutlineDotsVertical } from 'react-icons/hi';
import { MdDelete } from 'react-icons/md';
import { FaCopy } from 'react-icons/fa';

// custom hooks
import useDetectClickOutside from '../hooks/universal/useDetectClickOutside';

// utils
import { cn } from '../utils/utils';
import toast from 'react-hot-toast';

const MessageActionDropdown = ({
  emitDeleteMessageForAll,
  emitDeleteMessageMeRequest,
  chatId,
  id,
  senderId,
  isDeleted,
  message,
}) => {
  const [actions, setActions] = useState(false);
  const ref = useRef(null);
  const ignoreRef = useRef(null);
  const queryClient = useQueryClient();

  // toggle function for actions
  const toggleActions = () => {
    setActions((prev) => !prev);
  };

  const onHandleCopy = () => {
    navigator.clipboard
      .writeText(message)
      .then(() => {
        toast.success('Message has been copied to clipboard', {
          icon: <FaCopy className='text-purple' />,
        });
      })
      .catch(() => toast.error('Fail to copy message!'));
    toggleActions();
  };

  useDetectClickOutside(ref, () => toggleActions(), [ignoreRef]);

  const onHandleEmitDeleteMessageMeRequest = (isForAll) => {
    isForAll ? emitDeleteMessageForAll(id) : emitDeleteMessageMeRequest(id);
    if (!isForAll) {
      // setttings previous message on recent chat if we delete last displayed message from chat if there is a previous message
      const chatData = queryClient.getQueryData(['chat', chatId]);

      const firstPage = chatData?.pages?.[0];

      if (id === firstPage.messages[0].id) {
        const { message, id, createdAt } = firstPage.messages[1] ?? {};

        queryClient.setQueryData(['chats'], (prevData) => {
          if (!prevData) return;

          const updatedPages = prevData.pages.map((page) => {
            const updatedData = page.data.map((chat) => {
              return chat._id === chatId
                ? { ...chat, message: [{ message, _id: id, createdAt }] }
                : chat;
            });
            return { ...page, data: updatedData };
          });

          return { ...prevData, pages: updatedPages };
        });
      }
    }

    toggleActions();
  };

  return (
    <>
      {/* dropdown trigger  actions */}
      <button
        onClick={toggleActions}
        ref={ignoreRef}
        className={cn(
          'absolute top-3 z-40 dark:text-[#eff2f7]  rounded-md transition-all duration-300 text-gray-700 text-lg lg:text-xl',
          {
            '-right-5 lg:-right-6': !!senderId,
            '-left-4 lg:-left-5 text-gray-700': !senderId,
          }
        )}
      >
        <HiOutlineDotsVertical />
      </button>

      {/* triggered dropwdown */}
      <AnimatePresence>
        {actions && (
          <motion.ul
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            ref={ref}
            className={cn(
              'absolute z-[999]  dark:bg-gray-600 whitespace-nowrap  font-medium  text-gray-600 bg-white shadow-md rounded-md',

              {
                'top-9 -right-4': senderId,
                'top-8 -left-3 text-gray-700': !senderId,
              }
            )}
          >
            {/* handler for deleting message for self */}
            <li className='flex justify-between items-centergap-1 dark:hover:bg-gray-700  transition-all duration-300 px-2 py-[6px]  hover:bg-gray-200'>
              <button
                className='outline-none dark:text-[#eff2f7] flex items-center gap-2'
                onClick={() => onHandleEmitDeleteMessageMeRequest(false)}
              >
                Delete For Me <MdDelete />
              </button>
            </li>

            {/* handler for deleting message for all */}
            <li
              className={cn(
                'flex justify-between dark:text-[#eff2f7] items-center gap-1 transition-all  dark:hover:bg-gray-700  duration-300 px-2 py-[6px] hover:bg-gray-200 ',
                { hidden: senderId || isDeleted }
              )}
            >
              <button
                className='outline-none flex justify-between items-center gap-2'
                onClick={() => onHandleEmitDeleteMessageMeRequest(true)}
              >
                Delete For All <MdDelete />
              </button>
            </li>
            <li
              onClick={onHandleCopy}
              className='flex cursor-pointer dark:text-[#eff2f7] dark:hover:bg-gray-700   justify-between items-center px-2 py-[6px]  transition-all duration-300 hover:bg-gray-200'
            >
              Copy <FaCopy />
            </li>
          </motion.ul>
        )}
      </AnimatePresence>
    </>
  );
};

export default MessageActionDropdown;
