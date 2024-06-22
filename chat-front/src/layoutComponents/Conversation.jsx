import React from 'react';
import { motion } from 'framer-motion';

// components
import ConversationChatInfo from '../components/ConversationChatInfo';
import SendMessageForm from '../components/SendMessageForm';
import ConversationMessagesBox from '../components/ConversationMessagesBox';

// custom hooks
import { useScreenDetector } from '../hooks/universal/useScreenDetector';

// utils
import { cn } from '../utils/utils';

const Conversation = () => {
  const { isDesktop } = useScreenDetector();
  return (
    <motion.div
      initial={{ x: !isDesktop ? 400 : 0 }}
      animate={{ x: 0 }}
      key='chat'
      exit={{ x: !isDesktop ? 400 : 0 }}
      transition={{
        ease: 'easeInOut',
        duration: !isDesktop ? 0.4 : 0,
        delay: 0,
      }}
      className={cn('w-full overflow-hidden  dark:bg-[#262e35]', {
        'fixed top-0  bg-white z-[99999] h-mobile-chat-window  ': !isDesktop,
      })}
    >
      {/* chat details */}
      <ConversationChatInfo />

      {/* chat messages */}
      <ConversationMessagesBox />

      {/* form for sending the message */}
      <SendMessageForm />
    </motion.div>
  );
};

export default Conversation;
