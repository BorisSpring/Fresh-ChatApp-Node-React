import { useContext } from 'react';
import { SearchContext } from './searchContext';

export const useSearchContext = () => {
  const context = useContext(SearchContext);
  if (!context) throw new Error('There is no search context!');
  return context;
};
