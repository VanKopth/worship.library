'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

interface SongEditorProps {
    initialText: string;
    onSave: (html: string) => void;
}

export default function SongEditor({ initialText, onSave }: SongEditorProps) {
    const editor = useEditor({
        extensions: [StarterKit],
        content: initialText,
        immediatelyRender: false, // ✅ SSR issue fix
    });

    return (
        <div className="max-w-[700px] mx-auto">
            <EditorContent editor={editor} className="border border-gray-300 p-4 rounded-lg min-h-[200px]" />
            <button
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                onClick={() => onSave(editor?.getHTML() || '')}
            >
                Зберегти
            </button>
        </div>
    );
}
export {SongEditor};
