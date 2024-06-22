import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { FaUserMinus, FaUserPlus } from 'react-icons/fa';
import { MdClose } from 'react-icons/md';
import { RiAdminFill } from 'react-icons/ri';
import { MdAdminPanelSettings } from 'react-icons/md';

// context
import { useSelectedChatContext } from '../context/useSelectChatContext';
import { useSocketContext } from '../context/useSocketContext';

// custom hooks
import { useGetLoggedUser } from '../hooks/users/useGetLoggedUser';

// utils
import { getImageUrl } from '../utils/utils';

//components
import SelectGroupChatMember from './SelectGroupChatMember';
import useDetectClickOutside from '../hooks/universal/useDetectClickOutside';

const SingleGroupChatInfo = ({ toogleSettings }) => {
  const chatInfoRef = useRef(null);
  const { loggedUser } = useGetLoggedUser();
  const [isAdddMember, setIsAdddMember] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState([]);

  //  context
  const { selectedChat } = useSelectedChatContext();
  const socket = useSocketContext();

  const isAdmin = selectedChat.admins.some(
    (userId) => userId === loggedUser.user.id
  );
  const isCreator = selectedChat.createdBy === loggedUser.user.id;

  useDetectClickOutside(chatInfoRef, () => toogleSettings(), []);

  return (
    <motion.div
      ref={chatInfoRef}
      key='singleGroupChatInfo'
      initial={{ x: 400 }}
      animate={{ x: 0 }}
      exit={{ x: 400 }}
      transition={{ duration: 0.3 }}
      className='fixed right-0  h-screen top-0  z-[9999] overflow-y-auto  text-purple font-semibold dark:text-gray-100 bg-gray-200  w-full md:max-w-[450px] dark:bg-gray-700'
    >
      <div className='flex justify-between p-3 items-center '>
        <div className='flex items-center gap-2'>
          <h4>Participants</h4>
          {(isCreator || isAdmin) && (
            <button onClick={() => setIsAdddMember((prev) => !prev)}>
              <FaUserPlus />
            </button>
          )}
        </div>
        <button
          onClick={() => toogleSettings()}
          className='outline-none border-none text-lg lg:text-xl '
        >
          <MdClose />
        </button>
      </div>
      {!isAdddMember &&
        selectedChat?.participants
          ?.filter((participant) => participant.id !== loggedUser.user.id)
          .map(({ _id, image, name, lastName }) => (
            <div
              key={_id}
              className='flex items-center gap-2 p-3 border-b border-b-gray-600'
            >
              <img
                src={getImageUrl(image)}
                alt='user avatar'
                className='w-8 h-8 rounded-full'
              />
              <p>
                {name} {lastName}
              </p>
              <div className='ml-auto flex gap-2 items-center'>
                {isCreator && (
                  <button
                    onClick={() =>
                      socket.emit('grantOrRevokeAdminAuthority', {
                        userId: _id,
                        chatId: selectedChat.id,
                      })
                    }
                    className='outline-none border-none flex gap-1'
                  >
                    {selectedChat.admins.some((userId) => userId === _id) ? (
                      <RiAdminFill />
                    ) : (
                      <MdAdminPanelSettings />
                    )}
                  </button>
                )}

                {isCreator ||
                (isAdmin &&
                  !selectedChat.admins.some((userId) => userId === _id)) ? (
                  <button
                    onClick={() =>
                      socket.emit('kickUserFromGroupChat', {
                        chatId: selectedChat.id,
                        userId: _id,
                      })
                    }
                    className='outline-none border-none'
                  >
                    <FaUserMinus />
                  </button>
                ) : null}
              </div>
            </div>
          ))}

      {isAdddMember && (
        <div className='p-3'>
          <SelectGroupChatMember
            selectedMembers={selectedMembers}
            setSelectedMembers={setSelectedMembers}
            usersToFilter={selectedChat.participants}
          />
          {selectedMembers?.length > 0 && (
            <button
              className='main-btn'
              onClick={() => {
                socket.emit('addGroupChatMember', {
                  members: selectedMembers,
                  chatId: selectedChat.id,
                });
                setSelectedMembers(() => []);
                setIsAdddMember((prev) => !prev);
              }}
            >
              Add Users To Group Chat
            </button>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default SingleGroupChatInfo;
