import React from 'react';

// utils
import { cn, getImageUrl } from '../utils/utils';

// custom hook
import { useEmitChangeStatus } from '../hooks/sockets/useEmitChangeStatus';

const LoggedUserInformations = ({ loggedUser }) => {
  // socket function for handlign status change
  const onHandleEditStatus = useEmitChangeStatus();

  // status toggler
  const onHandleToggleStatus = () => {
    onHandleEditStatus(
      !loggedUser.user?.status || loggedUser.user?.status === 'active'
        ? 'busy'
        : 'active'
    );
  };
  return (
    <>
      {/* logged user informations */}
      <div className='flex flex-col dark:text-[#eff2f7]  items-center justify-center gap-3'>
        <img
          src={getImageUrl(loggedUser?.user?.image)}
          alt='user avatar'
          className='w-16 md:w-20 md:h-20 object-cover object-center border-2 dark:border-gray-400 border-white rounded-full'
        />
        <p className='text-center font-semibold text-sm md:text-base'>
          {loggedUser?.user?.name} {loggedUser?.user?.lastName}
        </p>
        <div className='flex items-center gap-2 -mt-3 '>
          <div
            className={cn(
              'w-[10px] h-[10px] rounded-full  bg-[#06d6a0] border-2 border-white',
              {
                'bg-yellow-700': loggedUser.user?.status === 'busy',
              }
            )}
          />
          <p>{loggedUser?.user?.status || 'Active'}</p>
          <button
            onClick={() => onHandleToggleStatus()}
            className={cn(
              'outline-none px-2 rounded-md dark:text-green-300 dark:bg-transparent bg-green-200 text-green-700  border-none  ',
              {
                ' bg-yellow-200 dark:text-yellow-300 text-yellow-700':
                  loggedUser?.user?.status === 'busy',
              }
            )}
          >
            Change status to{' '}
            {loggedUser?.user?.status === 'active' || !loggedUser?.user?.status
              ? 'Busy'
              : 'Active'}
          </button>
        </div>
      </div>

      {/* about user */}
      <p className='text-[15px]'>{loggedUser?.user?.statusText}</p>
    </>
  );
};

export default LoggedUserInformations;
