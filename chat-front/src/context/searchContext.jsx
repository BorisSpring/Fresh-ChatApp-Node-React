import { createContext, useState } from 'react';

const SearchContext = createContext();

const SearchContextProvider = ({ children }) => {
  const [query, setQuery] = useState('');

  return (
    <SearchContext.Provider value={{ query, setQuery }}>
      {children}
    </SearchContext.Provider>
  );
};

export { SearchContext };
export default SearchContextProvider;
