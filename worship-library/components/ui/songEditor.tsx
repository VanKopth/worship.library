'use client';

import {Input} from "@/components/ui";
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import {cn} from "@/lib/utils";
import {useEffect, useState} from "react";
import AudioUploader from "@/components/ui/audioUploader";

interface SongEditorProps {
    songId: number;
    title: string;
    initialText: string;
    audioUrl?: string | null;
    onSave: (songTitle: string, html: string) => void;
    onAudioUpload?: (url: string) => void;
}

export function SongEditor({songId, title, initialText, audioUrl, onSave, onAudioUpload }: SongEditorProps) {
    console.log('SongEditor received songId:', songId, 'Type:', typeof songId);
    const [songTitle, setSongTitle] = useState(title);

    const editor = useEditor({
        extensions: [StarterKit],
        content: initialText,
        immediatelyRender: false,
    });

    // Синхронізація заголовка з props
    useEffect(() => {
        setSongTitle(title);
    }, [title]);

    // Синхронізація контенту редактора з props
    useEffect(() => {
        if (editor && initialText !== editor.getHTML()) {
            editor.commands.setContent(initialText);
        }
    }, [initialText, editor]);

    const handleSave = () => {
        const textHtml = editor?.getHTML() || '';
        onSave(songTitle, textHtml);
    };

    return (
        <div className="max-w-[700px] mx-auto">
            <div className={cn('flex m-auto py-4')}>
                <Input
                    type="text"
                    placeholder="Song title"
                    value={songTitle}
                    onChange={(e) => setSongTitle(e.target.value)}
                    className={cn('font-bold')}
                />
            </div>
            
            {/* Audio Uploader Section */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Аудіо</h3>
                <AudioUploader 
                    songId={songId}
                    currentAudioUrl={audioUrl}
                    onUploadSuccess={onAudioUpload}
                />
            </div>
            
            <EditorContent editor={editor} className="border border-gray-300 p-4 rounded-lg min-h-[200px]" />
            <button
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                onClick={handleSave}
            >
                Зберегти текст
            </button>
        </div>
    );
}