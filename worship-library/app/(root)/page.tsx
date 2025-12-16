'use client';

import React, { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Song } from "@/prisma/generated/client";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Api } from "@/services/api-client";
import { useSearch } from "@/contexts/search-context";

export default function Home() {
    const [allSongs, setAllSongs] = useState<Song[]>([]);
    const { searchResults, isSearching } = useSearch();

    useEffect(() => {
        Api.songs.getAll().then((songs) => {
            const sorted = songs.sort((a, b) => a.id - b.id);
            setAllSongs(sorted);
        });
    }, []);

    const displaySongs = isSearching ? searchResults : allSongs;

    return (
        <div className={cn("flex flex-col mx-auto py-20 gap-4 w-[900px] max-w-[90%]")}>
            <div className={cn("shadow-2xl")}>
                <div className="fixed top-0 left-0 right-0 h-30 bg-gradient-to-b from-white via-white/90 pointer-events-none to-transparent z-10" />
                <Table>
                    <TableBody>
                        { displaySongs.map((song) => (
                            <TableRow key={song.id}>
                                <TableCell className="font-medium">
                                    <Link
                                        href={`/Song/${song.id}`}
                                        className={cn("flex items-center justify-center py-2")}
                                    >
                                        {song.songTitle}
                                    </Link>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}