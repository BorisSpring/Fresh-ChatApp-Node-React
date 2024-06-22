import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { MdGroup } from 'react-icons/md';

// components
import FormGroupElement from './FormGroupElement';
import SelectGroupChatMember from './SelectGroupChatMember';

// context
import { useSocketContext } from '../context/useSocketContext';

const GroupChatForm = ({ toggleIsAddGroup }) => {
  const {
    formState: { errors },
    register,
    handleSubmit,
  } = useForm();
  const [selectedMembers, setSelectedMembers] = useState([]);

  // context
  const socket = useSocketContext();

  const onHandleSubmit = (data) => {
    const selectedMemebersIds = selectedMembers.map((member) => member.id);
    socket.emit('createGroupChat', {
      participants: selectedMemebersIds,
      chatName: data.chatName,
    });
    toggleIsAddGroup();
  };

  return (
    <div
      onClick={() => toggleIsAddGroup()}
      className='fixed w-full h-full z-[999999] backdrop-blur-sm bg-black/30 flex items-center justify-center'
    >
      <motion.form
        initial={{ y: -150, opacity: 0 }}
        exit={{ y: -150, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit(onHandleSubmit)}
        className='w-[90%] m-auto max-w-[400px] dark:bg-gray-700 max-h-[650px] flex flex-col gap-3 text-gray-600  bg-white p-3 md:p-5 rounded-sm shadow-sm'
      >
        {/* email adress */}
        <FormGroupElement
          label='Group Chat Name'
          type='text'
          placeholder='Group Chat Name'
          register={{
            ...register('chatName', {
              required: 'Group chat name is required!',
              validate: (value) =>
                (value?.trim().length > 0 && value?.trim().length < 21) ||
                'Group chat name must be between 1 and 20 char long!',
            }),
          }}
          icon={<MdGroup className='text-purple text-lg' />}
          errorMsg={errors?.chatName?.message}
        />

        {/* compoennt for selecting group member for chat */}
        <SelectGroupChatMember
          selectedMembers={selectedMembers}
          setSelectedMembers={setSelectedMembers}
        />
        <button
          type='submit'
          className='main-btn dark:hover:bg-gray-800 dark:hover-text-lightestPurple dark:bg-darkPurple dark:text-[#eff2f7]'
        >
          Create Group Chat
        </button>
      </motion.form>
    </div>
  );
};

export default GroupChatForm;
