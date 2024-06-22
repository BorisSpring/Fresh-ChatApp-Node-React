import React from 'react';
import { motion } from 'framer-motion';

import { FaChevronLeft } from 'react-icons/fa';

// custom hooks
import { useScreenDetector } from '../hooks/universal/useScreenDetector';
import UpdateUserInfoForm from './UpdateUserInfoForm';
import UpdateUserPictureForm from './UpdateUserPictureForm';

const UpdateUserInfo = ({
  loggedUser,
  updateRef,
  onHandleToggleSettingsState,
}) => {
  // checking isDesktop or not because of animation
  const { isDesktop } = useScreenDetector();

  return (
    <motion.div
      ref={updateRef}
      initial={{ opacity: 0, x: isDesktop ? -600 : -450 }}
      animate={{ opacity: 1, x: isDesktop ? 0 : -50 }}
      key='updateUserInfo'
      exit={{ opacity: 1, x: isDesktop ? -600 : -450 }}
      transition={{ duration: 0.3 }}
      className='left-container absolute overflow-y-auto  dark:bg-[#36404a] p-4 flex flex-col   left-[58px]  bg-white z-40 '
    >
      <div className='flex justify-between dark:text-[#eff2f7]  text-gray-600'>
        {/* toggle button */}
        <button
          className='outline-none border-none'
          onClick={() => onHandleToggleSettingsState('isEdit')}
        >
          <FaChevronLeft />
        </button>
        <h3 className='font-medium text-lg md:text-xl '>Update Settings</h3>
      </div>

      {/* update user picture form */}
      <UpdateUserPictureForm loggedUserImageName={loggedUser?.user?.image} />

      {/* update user info form */}
      <UpdateUserInfoForm
        loggedUser={loggedUser}
        onHandleToggleSettingsState={onHandleToggleSettingsState}
      />
    </motion.div>
  );
};

export default UpdateUserInfo;
