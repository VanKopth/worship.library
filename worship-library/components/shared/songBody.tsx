'use client'

import {EditorContent, useEditor} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import React from "react";
import {cn} from "@/lib/utils";

interface Props {
    songBody?: string;
}

export const SongBody : React.FC<React.PropsWithChildren<Props>> = ({ songBody, children }) => {
    const editor = useEditor({
        extensions: [StarterKit],
        content: songBody,
        immediatelyRender: false,
        editable: false,
    });
    
    return (
        <div className={cn('flex p-4 border-[1px] border-gray-200 rounded-lg shadow-2xl')}>
            <EditorContent editor={editor} className={cn("p-2")}/>
        </div>
    )
}
