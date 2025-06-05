import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SearchContextType {
  isSearchOpen: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  toggleSearch: () => void;
  closeSearch: () => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};

interface SearchProviderProps {
  children: ReactNode;
}

export const SearchProvider: React.FC<SearchProviderProps> = ({ children }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleSearch = () => setIsSearchOpen(!isSearchOpen);
  const closeSearch = () => setIsSearchOpen(false);

  return (
    <SearchContext.Provider value={{
      isSearchOpen,
      searchQuery,
      setSearchQuery,
      toggleSearch,
      closeSearch
    }}>
      {children}
    </SearchContext.Provider>
  );
};