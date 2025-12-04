'use client';
import {SongEditor} from '@/components/ui';
import {Song} from "@/prisma/generated/client";
import {Api} from "@/services/api-client";
import {updateSong} from "@/services/songs";

interface SongEditorWrapperProps {
    song: Song;
}
export default function SongEditorWrapper({ song }: SongEditorWrapperProps) {
    const handleSave = async (html: string) => {
        await updateSong(Number(song.id), { songText: html });

        alert('Текст збережено!');
    };



    return <SongEditor initialText={song.songText} onSave={handleSave} />;
}
