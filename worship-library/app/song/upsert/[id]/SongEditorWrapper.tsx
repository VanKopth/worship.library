'use client';
import {SongEditor} from '@/components/ui';
import {Song} from "@/prisma/generated/client";
import {Api} from "@/services/api-client";
import {updateSong} from "@/services/songs";
import {useState} from "react";

interface SongEditorWrapperProps {
    song: Song;
}
export default function SongEditorWrapper({ song }: SongEditorWrapperProps) {
    console.log('Song in wrapper:', song);
    console.log('Song ID:', song.id, 'Type:', typeof song.id);
    const [audioUrl, setAudioUrl] = useState<string | null>(song.audioUrl);

    const handleSave = async (title: string, html: string) => {
        await updateSong(Number(song.id), {songTitle: title, songText: html });
        alert('Текст збережено!');
    };

    const handleAudioUpload = (url: string) => {
        setAudioUrl(url);
        alert('Аудіо успішно завантажено!');
    };

    return (
        <SongEditor 
            songId={Number(song.id)}
            title={song.songTitle || ''}
            initialText={song.songText} 
            audioUrl={audioUrl}
            onSave={handleSave}
            onAudioUpload={handleAudioUpload}
        />
    );
}
