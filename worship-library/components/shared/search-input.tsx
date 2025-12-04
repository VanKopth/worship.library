'use client'

import React from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui";
import { Api } from "@/services/api-client";
import { useDebouncedCallback } from "use-debounce";
import { useSearch } from "@/contexts/search-context";

interface Props {
    className?: string;
}

export const SearchInput: React.FC<Props> = ({ className }) => {
    const [searchQuery, setSearchQuery] = React.useState('');
    const [isFocused, setIsFocused] = React.useState(false);
    const { setSearchResults, setIsSearching } = useSearch();

    const debouncedSearch = useDebouncedCallback((query: string) => {
        if (query.trim()) {
            setIsSearching(true);
            Api.songs.search(query).then((songs) => {
                setSearchResults(songs);
            });
        } else {
            setIsSearching(false);
            setSearchResults([]);
        }
    }, 500);

    React.useEffect(() => {
        debouncedSearch(searchQuery);
    }, [searchQuery, debouncedSearch]);

    return (
        <div className={cn('w-full', className)}>
            <Input
                type="search"
                placeholder="Search..."
                className={cn('w-full h-12 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 backdrop-blur-xs backdrop-saturation-[200%] shadow-sm bg-[#000000]/5 transition-all duration-300 ease-in-out', isFocused ? 'scale-105': 'scale-100')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
            />
        </div>
    );
}