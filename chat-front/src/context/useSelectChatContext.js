import { useContext } from 'react';
import { SelectedChatContext } from './selectChatContext';

export const useSelectedChatContext = () => {
  const context = useContext(SelectedChatContext);
  if (!context)
    throw new Error(
      'use selected chat must be used withing selec chat provider!'
    );
  return context;
};
