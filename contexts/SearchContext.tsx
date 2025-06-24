import React, { createContext, useState, useCallback, ReactNode, useMemo } from 'react';
import { SearchContextType } from '../types';

export const SearchContext = createContext<SearchContextType | undefined>(undefined);

interface SearchProviderProps {
  children: ReactNode;
}

export const SearchProvider: React.FC<SearchProviderProps> = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');

  const handleSetSearchTerm = useCallback((term: string) => {
    setSearchTerm(term);
  }, []);

  const contextValue = useMemo(() => ({
    searchTerm,
    setSearchTerm: handleSetSearchTerm,
  }), [searchTerm, handleSetSearchTerm]);

  return (
    <SearchContext.Provider value={contextValue}>
      {children}
    </SearchContext.Provider>
  );
};