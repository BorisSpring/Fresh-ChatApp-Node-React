import React from 'react';
import { CircleLoader } from 'react-spinners';

// compponents
import SearchUser from '../components/SearchUser';

// context
import { useSelectedChatContext } from '../context/useSelectChatContext';
import { useSearchContext } from '../context/useSearchContext';

const SearchedUsers = ({ searchUsers, isLoadingSearchedUsers }) => {
  const { setQuery } = useSearchContext();
  const { setSelectedChat } = useSelectedChatContext();
  return (
    <>
      <h3 className='font-bold px-4 text-sm md:text-base text-gray-600 dark:text-[#eff2f7]'>
        Searched Users
      </h3>
      <div className='h-full overflow-y-auto   -mt-3 mb-1'>
        {/* displaying loader if loading user chats */}
        {isLoadingSearchedUsers && (
          <CircleLoader color='#7269ef' className='m-auto mt-[100px]' />
        )}

        {/* dispalying user recent chats */}
        {searchUsers?.data?.map((searchedUser, i) => (
          <SearchUser
            setQuery={setQuery}
            setSelectedChat={setSelectedChat}
            {...searchedUser}
            key={i}
          />
        ))}
      </div>
    </>
  );
};

export default SearchedUsers;
