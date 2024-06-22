import React from 'react';
import { getImageUrl } from '../utils/utils';

const SearchUser = ({
  setQuery,
  setSelectedChat,
  name,
  lastName,
  email,
  id,
  image,
}) => {
  return (
    <div
      onClick={() => {
        setQuery(() => '');
        setSelectedChat(() => ({
          name,
          lastName,
          participantId: id,
          isGroup: false,
        }));
      }}
      className='flex px-4 dark:hover:bg-gray-700 dark:text-[#eff2f7] dark:bg-transparent dark:border-b-gray-600  cursor-pointer justify-between gap-2 border-b border-gray-200  hover:bg-gray-100 bg-gray-50 p-2 items-center'
    >
      <img
        src={getImageUrl(image)}
        alt='user avatar'
        className='w-9 h-9 rounded-full'
      />

      <div className='flex flex-col min-h-[37.5px]   w-full'>
        <h6 className='font-semibold text-[13px] md:text-[15px] dark:text-[#eff2f7] text-gray-600'>
          {name} {lastName}
        </h6>
        <p className='text-[12px] md:text-[13px] dark:text-[#abb4d2] text-ellipsis line-clamp-1  overflow-hidden text-gray-500'>
          {email}
        </p>
      </div>
    </div>
  );
};

export default SearchUser;
