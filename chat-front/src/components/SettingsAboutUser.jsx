import React from 'react';
import { FaChevronDown, FaChevronUp, FaUser } from 'react-icons/fa';
import { cn } from '../utils/utils';

const SettingsAboutUser = ({
  onHandleToggleSettingsState,
  isAboutOpen,
  loggedUser,
}) => {
  const { email, name, createdAt, lastName } = loggedUser.user;

  return (
    <div className='flex flex-col rounded-md shadow-sm  cursor-pointer overflow-hidden'>
      {/*  toggle for open close about section */}
      <div
        onClick={() => onHandleToggleSettingsState('isAboutOpen')}
        className='flex justify-between items-center bg-gray-100 dark:bg-gray-600 hover:bg-gray-200 transition-all duration-300  p-2'
      >
        <p className='flex items-center gap-2 dark:text-gray-200 text-sm font-semibold'>
          <FaUser className='text-base ' /> About
        </p>
        {isAboutOpen ? (
          <FaChevronDown className='text-[14px] dark:text-gray-200' />
        ) : (
          <FaChevronUp className='text-[14px] dark:text-gray-200' />
        )}
      </div>
      <div
        className={cn(
          ' flex-col gap-3 dark:bg-gray-600 p-2 dark:text-[#eff2f7]  bg-white flex',
          {
            'h-0 opacity-0 p-0': !isAboutOpen,
            ' h-auto opacity-100': isAboutOpen,
          }
        )}
      >
        {/* user name */}
        <div className='flex flex-col '>
          <p className='text-gray-500 dark:text-gray-200  text-sm'>Name</p>
          <p className='font-semibold text-base '>{name}</p>
        </div>

        {/* user last name */}
        <div className='flex flex-col'>
          <p className='text-gray-500 dark:text-gray-200 text-sm'>Last Name</p>
          <p className='font-semibold text-base '> {lastName}</p>
        </div>

        {/* user email */}
        <div className='flex flex-col'>
          <p className='text-gray-500 dark:text-gray-200 text-sm'>
            Email address
          </p>
          <p className='font-semibold text-base '>{email}</p>
        </div>

        {/* joined */}
        <div className='flex flex-col'>
          <p className='text-gray-500 text-sm dark:text-gray-200'>Joined at</p>
          <p className='font-semibold text-base '>
            {new Date(createdAt).toLocaleDateString?.('en-US', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            })}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SettingsAboutUser;
