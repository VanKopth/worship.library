import { Api } from "@/services/api-client";
import {Container} from "@/components/shared";
import {cn} from "@/lib/utils";
import SongEditorWrapper from "@/app/Song/Upsert/[id]/SongEditorWrapper";


export default async function SongPage({params}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params;

    return (
            <div className="mx-auto shadow-2xl p-4">
                <div className={cn('flex m-auto py-4')}>
                </div>
            </div>
    );
}