import { useContext } from 'react';
import { SocketContext } from './socketContext';

export function useSocketContext() {
  const context = useContext(SocketContext);
  if (!context)
    throw new Error('Cannot use socket context outside of context!');

  return context;
}
