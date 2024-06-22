import React from 'react';

// components
import UserSearch from '../components/UserSearch';
import ActiveUsersSwiper from '../components/ActiveUsersSwiper';
import RecentChats from '../components/RecentChats';
import SearchedUsers from '../components/SearchedUsers';

// custom hook
import { useSearchUser } from '../hooks/users/useSearchUser';

const Chats = () => {
  const { searchUsers, isLoadingSearchedUsers } = useSearchUser();

  return (
    <section className='pt-4 bg-gray-50   dark:bg-[#36404a] h-full flex flex-col gap-3 md:gap-5 w-full lg:max-w-[390px]'>
      <div className='px-4 flex flex-col gap-3'>
        {/* heading for left side chats */}
        <h3 className='font-bold text-xl text-gray-600 dark:text-[#eff2f7]'>
          Chats
        </h3>

        {/* user search  */}
        <UserSearch />

        {/* actived user that user has alerdy chat with */}
        <ActiveUsersSwiper />
      </div>

      {/* dispaly recent user chats if there is no serached users otherwise we are displayign searched users */}
      {searchUsers?.data ? (
        <SearchedUsers
          searchUsers={searchUsers}
          isLoadingSearchedUsers={isLoadingSearchedUsers}
        />
      ) : (
        <RecentChats />
      )}
    </section>
  );
};

export default Chats;
