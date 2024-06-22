import React from 'react';
import { getImageUrl } from '../utils/utils';

const ActiveUser = ({ setSelectedChat, chatDetails }) => {
  const { _id, isGroup, participants } = chatDetails;
  const { name, lastName, status, _id: participantId, image } = participants[0];
  return (
    <button
      onClick={() =>
        setSelectedChat(() => ({
          id: _id,
          name,
          lastName,
          status,
          participantId,
          isGroup,
        }))
      }
      className='min-w-[71px] max-w-[71px]  max-h-[51px] min-h-[51px] flex-col  flex items-center justify-center  rounded-lg dark:bg-gray-600 bg-gray-200'
    >
      <div className='relative w-9 h-9 -mt-[17px]'>
        {/* user image */}
        <img
          src={getImageUrl(image)}
          alt='user avatar'
          className='w-9 h-9 rounded-full dark:border-gray-600 dark:border-2'
        />
        {/* user status */}
        <div className='w-[10px] h-[10px] rounded-full bg-[#06d6a0] absolute bottom-0 border-2 border-white right-0'></div>
      </div>
      {/* user name */}
      <span className=' text-gray-500 text-sm mt-1 font-bold dark:text-[#eff2f7]'>
        {name}
      </span>
    </button>
  );
};

export default ActiveUser;
