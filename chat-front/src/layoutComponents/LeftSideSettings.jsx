import React, { useRef, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { BsThreeDotsVertical } from 'react-icons/bs';

// components
import UpdateUserInfo from '../components/UpdateUserInfo';
import LoggedUserInformations from '../components/LoggedUserInformations';
import SettingsAboutUser from '../components/SettingsAboutUser';

// custom hooks
import useDetectClickOutside from '../hooks/universal/useDetectClickOutside';
import { useGetLoggedUser } from '../hooks/users/useGetLoggedUser';

const LeftSideSettings = () => {
  const { loggedUser } = useGetLoggedUser();
  const updateRef = useRef(null);
  const buttonRef = useRef(null);

  const [settingsState, setSettingsState] = useState({
    isAboutOpen: false,
    isEdit: false,
  });

  // toggling function
  const onHandleToggleSettingsState = (type) =>
    setSettingsState((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));

  // detecting click outside to toggle off on
  useDetectClickOutside(
    updateRef,
    () => onHandleToggleSettingsState('isEdit'),
    [buttonRef]
  );

  return (
    <>
      <section className='left-container dark:bg-[#36404a] relative text-gray-500 p-4 flex flex-col gap-5 md:gap-8 overflow-y-auto '>
        {/* settings heading */}
        <div className='flex justify-between items-center relative dark:text-[#eff2f7]'>
          <h3 className='font-medium text-lg md:text-xl'>My Profile</h3>

          {/* button for toggling off/on update settings */}
          <button
            ref={buttonRef}
            onClick={() => onHandleToggleSettingsState('isEdit')}
            className='outline-none border-none hover:text-gray-800 transition-all duration-300'
          >
            <BsThreeDotsVertical className='text-[16px] lg:text-[18px]' />
          </button>
        </div>

        {/* logged user status and name and status toggler */}
        <LoggedUserInformations loggedUser={loggedUser} />

        {/* about section */}
        <SettingsAboutUser
          onHandleToggleSettingsState={onHandleToggleSettingsState}
          loggedUser={loggedUser}
          isAboutOpen={settingsState.isAboutOpen}
        />
      </section>

      {/* if is edit it is displaying update user info component */}
      <AnimatePresence>
        {settingsState.isEdit && (
          <UpdateUserInfo
            loggedUser={loggedUser}
            updateRef={updateRef}
            onHandleToggleSettingsState={onHandleToggleSettingsState}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default LeftSideSettings;
