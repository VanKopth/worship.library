'use client'

import React, { createContext, useContext, useState } from 'react';
import { Song } from '@/prisma/generated/client';

interface SearchContextType {
    searchResults: Song[];
    setSearchResults: (songs: Song[]) => void;
    isSearching: boolean;
    setIsSearching: (value: boolean) => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [searchResults, setSearchResults] = useState<Song[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    return (
        <SearchContext.Provider value={{ searchResults, setSearchResults, isSearching, setIsSearching }}>
            {children}
        </SearchContext.Provider>
    );
};

export const useSearch = () => {
    const context = useContext(SearchContext);
    if (!context) {
        throw new Error('useSearch must be used within SearchProvider');
    }
    return context;
};