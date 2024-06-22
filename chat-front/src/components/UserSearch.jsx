import React from 'react';
import { IoIosSearch } from 'react-icons/io';

// custom hook
import { useSearchContext } from '../context/useSearchContext';

const UserSearch = () => {
  const { setQuery, query } = useSearchContext();
  return (
    <div className='bg-gray-200 dark:bg-gray-600 flex items-center gap-2 px-2 py-1 lg:py-2 lg:px-4 rounded-md'>
      <IoIosSearch className='text-lg lg:text-2xl text-gray-500 dark:text-[#eff2f7]' />
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        type='text'
        className='outline-none dark:text-[#eff2f7] dark:bg-gray-600 max-w-[250px] text-sm text-gray-600  bg-gray-200'
        placeholder='Search users by email...'
      />
    </div>
  );
};

export default UserSearch;
