import React, { useEffect, useRef, useState } from 'react';
import ActiveUser from './ActiveUser';
// import function for register Swiper custom elements
import { register } from 'swiper/element/bundle';

// registering Swiper custom elements
register();

// custom hooks
import { useGetUserChats } from '../hooks/chats/useGetUserChats';

// context
import { useSelectedChatContext } from '../context/useSelectChatContext';

const ActiveUsers = () => {
  const [activeUsers, setActiveUsers] = useState([]);
  const { userChats } = useGetUserChats();
  const { setSelectedChat } = useSelectedChatContext();

  useEffect(() => {
    setActiveUsers(() =>
      userChats?.pages?.flatMap((page) =>
        page.data.filter(
          (userChat) => userChat.participants[0].status === 'active'
        )
      )
    );
  }, [userChats]);

  return (
    <div className='lg:max-w-[400px]'>
      <swiper-container
        mousewheel-invert='true'
        slides-per-view={window.innerWidth > 1024 ? '4' : 8}
      >
        {activeUsers?.map?.((activeUserChatDetails) => (
          <swiper-slide key={activeUserChatDetails._id}>
            <ActiveUser
              setSelectedChat={setSelectedChat}
              chatDetails={activeUserChatDetails}
            />
          </swiper-slide>
        ))}
      </swiper-container>
    </div>
  );
};

export default ActiveUsers;
