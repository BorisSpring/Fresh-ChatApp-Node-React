import React from 'react';
import { FaMessage } from 'react-icons/fa6';
import { FaUserGroup } from 'react-icons/fa6';
import { IoMdSettings } from 'react-icons/io';
import { Link, useNavigate } from 'react-router-dom';
import { TiWorld } from 'react-icons/ti';
import { IoIosMoon } from 'react-icons/io';

// custom hook for socket
import { useEmitChangeStatus } from '../hooks/sockets/useEmitChangeStatus';
import { useGetLoggedUser } from '../hooks/users/useGetLoggedUser';

// utils
import { getImageUrl } from '../utils/utils';

const links = [
  {
    path: '/chats',
    icon: (
      <FaMessage className='text-[16px] lg:text-[19px] ark:text-lightestPurple text-purple' />
    ),
  },
  {
    path: '/groups',
    icon: (
      <FaUserGroup className='text-[16px] lg:text-[19px] ark:text-lightestPurple text-purple' />
    ),
  },

  {
    path: '/settings',
    icon: (
      <IoMdSettings className='text-lg lg:text-2xl ark:text-lightestPurple text-purple' />
    ),
  },
];

const Navigation = () => {
  const navigate = useNavigate();
  const { loggedUser } = useGetLoggedUser();
  const onHandleEditStatus = useEmitChangeStatus();

  const toggleDarkMode = () => {
    document.documentElement.classList.toggle('dark');
  };

  return (
    <nav className='w-screen items-center overflow-hidden  dark:bg-gray-700 px-5 pt-1 border-t-2 border-purple lg:border-t-0 lg:py-4 lg:justify-between gap-5 lg:gap-0 justify-between flex lg:flex-col lg:items-center lg:px-2  lg:w-fit lg:h-screen'>
      {/* app logo */}
      <img
        src='/img/logo.jpg'
        alt='app logo'
        className='w-12 rounded-full object-contain inline-block relative '
      />

      {/* middle navigation links */}
      <ul className='flex justify-between w-full max-w-[150px] lg:max-w-none   lg:flex-col  lg:h-fit lg:gap-5'>
        {links?.map(({ path, icon }) => (
          <li
            key={path}
            className='w-9 h-9 flex items-center  justify-center rounded-md dark:hover:bg-gray-600 hover:bg-gray-200'
          >
            <Link to={path}>{icon}</Link>
          </li>
        ))}
      </ul>

      {/* end navigation links */}
      <ul className='flex lg:flex-col w-fit dark:text-lightestPurple text-purple  lg:items-center lg:gap-5'>
        <li className='hidden lg:inline-block '>
          <button>
            <TiWorld className='text-lg lg:text-2xl dark:hover:bg-gray-600  hover:bg-gray-200 rounded-md ' />
          </button>
        </li>
        <li className='hidden lg:inline-block '>
          <button onClick={toggleDarkMode}>
            <IoIosMoon className='text-lg lg:text-2xl dark:hover:bg-gray-600   hover:bg-gray-200 rounded-md ' />
          </button>
        </li>
        <li
          className='rounded-full overflow-hidden cursor-pointer'
          onClick={() => {
            localStorage.removeItem('jwt');
            onHandleEditStatus('offline');
            navigate('/');
          }}
        >
          {/* user picture */}
          <img
            src={getImageUrl(loggedUser?.user?.image)}
            alt='user avatar'
            className='w-8 h-8 rounded-full'
          />
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
