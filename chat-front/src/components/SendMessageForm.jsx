import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Picker from 'emoji-picker-react';
import { MdEmojiEmotions } from 'react-icons/md';
import { IoMdAttach } from 'react-icons/io';
import { MdImage } from 'react-icons/md';
import { IoMdSend } from 'react-icons/io';

// context
import { useSocketContext } from '../context/useSocketContext';
import { useSelectedChatContext } from '../context/useSelectChatContext';

// custom socket hook
import { useEmitSendFileOrImage } from '../hooks/sockets/useEmitSendFileOrImage';
import { useQueryClient } from '@tanstack/react-query';
import { updateChatNotificationAndEmitSeenMessages } from '../utils/utils';

const SendMessageForm = () => {
  // form state
  const [emojiIsOpen, setEmojiIsOpen] = useState(false);
  const queryClient = useQueryClient();
  const {
    formState: { errors },
    register,
    handleSubmit,
    getValues,
    setValue,
    reset,
  } = useForm();

  //  contexts
  const socket = useSocketContext();
  const { selectedChat } = useSelectedChatContext();
  const { isGroup, id, participantId } = selectedChat ?? {};

  // function for  sending file thru the socket
  const emitSendFileOrImage = useEmitSendFileOrImage(socket);

  // toggling visible state for emojis
  const handleToggleEmojis = () => setEmojiIsOpen((prev) => !prev);

  // adding emoji to message affter selecting
  const onHandleEmojiClick = (data) => {
    const currentMsg = getValues('message');
    setValue('message', `${currentMsg || ''} ${data.emoji} `);
    handleToggleEmojis();
  };

  const emitSeenMessages = () => {
    selectedChat.unreadedMessages > 0 &&
      updateChatNotificationAndEmitSeenMessages(
        selectedChat.id,
        selectedChat.isGroup,
        queryClient,
        socket
      );
  };

  // on handling submit new text message
  const onHandleSubmitTextMessage = (data) => {
    emitSeenMessages();
    socket.emit('newMessage', {
      isGroup: isGroup,
      chatId: id,
      message: data.message,
      receiverId: participantId,
    });

    reset();
  };

  // on handling sending image or file message
  const emitSendFileOrImageMessage = (e, isImage) => {
    const file = e.target.files[0];
    if (file) {
      emitSeenMessages();
      emitSendFileOrImage(
        e.target.files[0],
        isGroup,
        participantId,
        id,
        isImage
      );
    }
  };

  return (
    <div className='lg:h-[75px] dark:border-t-gray-700 dark:border-t-2 p-2  lg:px-7 border-t border-gray-200  relative  flex items-center justify-between'>
      {/* message form */}
      <form
        onSubmit={handleSubmit(onHandleSubmitTextMessage)}
        encType='multipart/form-data'
        className='w-[90%] flex gap-2 '
      >
        <p className='text-red-700 dark:text-red-300 text-xs'>
          {errors?.message?.message}
        </p>
        {/* input for message */}
        <textarea
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              onHandleSubmitTextMessage({ message: getValues('message') });
              reset();
            }
          }}
          rows={2}
          {...register('message', { required: 'Message is required!' })}
          placeholder='Enter the message...'
          type='text'
          className='outline-none focus:border-purple dark:border-purple dark:text-[#eff2f7] dark:placeholder:text-[#eff2f7] dark:focus:border-lightPurple dark:bg-[#36404a] border-2 resize-none bg-gray-100 text-sm text-gray-600 px-3 py-1 rounded-md w-full'
        />

        {/* button for sending the message */}
        <button className='bg-purple   hover:bg-darkPurple transition-all duration-300 text-white px-3 py-1 rounded-md'>
          <IoMdSend />
        </button>

        {/* input for files */}
        <input
          type='file'
          id='file'
          className='hidden'
          accept='video/*,.txt,.pdf,.doc,.docx'
          onChange={(e) => emitSendFileOrImageMessage(e, false)}
        />

        {/* input for images */}
        <input
          type='file'
          id='image'
          className='hidden'
          accept='image/*'
          onChange={(e) => emitSendFileOrImageMessage(e, true)}
        />
      </form>
      <div className='text-purple dark:text-lightestPurple  flex gap-2 md:gap-3 items-center md:text-lg'>
        <MdEmojiEmotions
          className='cursor-pointer'
          onClick={handleToggleEmojis}
        />

        {/* emoji picker */}
        {emojiIsOpen && (
          <div className='absolute right-[140px] top-[-460px] z-40'>
            <Picker
              lazyLoadEmojis={true}
              position='topLeft'
              className='h-[250px] w-[300px]'
              open={emojiIsOpen}
              onEmojiClick={onHandleEmojiClick}
            />
          </div>
        )}

        {/* file picker */}
        <label htmlFor='file'>
          <IoMdAttach className='cursor-pointer' />
        </label>

        {/* image picker */}
        <label htmlFor='image'>
          <MdImage className='cursor-pointer' />
        </label>
      </div>
    </div>
  );
};

export default SendMessageForm;
