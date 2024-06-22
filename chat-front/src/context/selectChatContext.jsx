import { createContext, useState } from 'react';

const SelectedChatContext = createContext();

const SelectedChatProvider = ({ children }) => {
  const [selectedChat, setSelectedChat] = useState();
  return (
    <SelectedChatContext.Provider value={{ selectedChat, setSelectedChat }}>
      {children}
    </SelectedChatContext.Provider>
  );
};

export { SelectedChatContext };
export default SelectedChatProvider;
