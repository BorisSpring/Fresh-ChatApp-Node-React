import React from 'react';
import UserSearch from './UserSearch';
import { useSearchUser } from '../hooks/users/useSearchUser';
import { CircleLoader } from 'react-spinners';
import { getImageUrl } from '../utils/utils';
import { IoMdClose } from 'react-icons/io';

const SelectGroupChatMember = ({
  selectedMembers,
  setSelectedMembers,
  usersToFilter,
}) => {
  const { searchUsers, isLoadingSearchedUsers } = useSearchUser();

  const onHandleAddParticipants = (user) => {
    const selectedMember = selectedMembers.find(
      (selectedUser) => selectedUser.id === user.id
    );
    if (!selectedMember) setSelectedMembers((prev) => [...prev, user]);
  };

  const onHandleRemoveSelectedUser = (userEmail) => {
    setSelectedMembers((prev) =>
      prev.filter((user) => user.email !== userEmail)
    );
  };

  const searchedUsers = searchUsers?.data?.filter(
    (searchedUserData) =>
      !usersToFilter?.some?.((user) => user._id === searchedUserData.id)
  );

  return (
    <div className=' flex flex-col gap-2 '>
      {/* selected users */}
      <div className='max-h-[220px] overflow-y-auto flex flex-col gap-2'>
        <h3 className='font-medium text-gray-600 dark:text-[#eff2f7]'>
          Selected Group Member
        </h3>
        {selectedMembers?.map(({ email, name }, i) => (
          <div
            key={email}
            className='text-gray-600 dark:text-[#eff2f7] dark:border-gray-900 border rounded-md shadow-sm p-1 flex items-center justify-between text-sm'
          >
            <div>
              <p>email: {email}</p>
              <p>name: {name}</p>
            </div>
            <button
              className='border-none  outline-none'
              onClick={(e) => {
                e.preventDefault();
                onHandleRemoveSelectedUser(email);
              }}
            >
              <IoMdClose />
            </button>
          </div>
        ))}
      </div>

      {/* field for searching the users by email */}
      <UserSearch />

      {/* searched users */}
      <div className='max-w-[450px] max-h-[220px] overflow-y-auto flex flex-col gap-2'>
        {!isLoadingSearchedUsers ? (
          searchedUsers?.map?.((user) => (
            <div
              key={user.id}
              onClick={() => onHandleAddParticipants(user)}
              className='flex gap-2 items-center border p-1 text-sm rounded-md dark:text-[#eff2f7] cursor-pointer dark:border-gray-800 dark:hover:bg-gray-800 hover:bg-gray-50'
            >
              <img
                src={getImageUrl(user.image)}
                className='w-8 h-8 rounded-full'
                alt='user avatar'
              />
              <div className='flex flex-col'>
                <p>{user.name}</p>
                <p>{user.email}</p>
              </div>
            </div>
          ))
        ) : (
          <CircleLoader color='#7269ef' className='m-auto' />
        )}
      </div>
    </div>
  );
};

export default SelectGroupChatMember;
