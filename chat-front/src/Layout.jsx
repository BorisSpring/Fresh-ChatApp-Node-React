import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// components
import Navigation from './components/Navigation';
import Conversation from './layoutComponents/Conversation';

// cusotm hook
import { useGetLoggedUser } from './hooks/users/useGetLoggedUser';

// context
import { useSocketContext } from './context/useSocketContext';
import { useSelectedChatContext } from './context/useSelectChatContext';

const Layout = () => {
  // selected chat context
  const { selectedChat } = useSelectedChatContext();

  // socket context
  const socket = useSocketContext();
  const { loggedUser } = useGetLoggedUser();

  useEffect(() => {
    if (socket) {
      socket.emit('changeStatus', {
        userId: loggedUser?.user?.id,
        status: 'active',
      });
    }
  }, []);

  return (
    <div className='flex flex-col-reverse dark:bg-[#262e35] dark:text-white h-screen lg:flex-row overflow-hidden'>
      {/* navigation */}
      <Navigation />

      {/* layout components for left side */}
      <Outlet />

      {/* displaying selected chat if there is any in our select chat context! */}
      <AnimatePresence>{selectedChat && <Conversation />}</AnimatePresence>
    </div>
  );
};

export default Layout;
