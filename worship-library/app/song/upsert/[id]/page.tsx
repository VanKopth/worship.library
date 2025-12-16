import { Api } from "@/services/api-client";
import {Container} from "@/components/shared";
import {cn} from "@/lib/utils";
import SongEditorWrapper from "./SongEditorWrapper";


export default async function SongPage({params}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params;
    const song = await Api.songs.getById(Number(id));

    return (
        <Container className={cn("flex mx-auto py-1 px-5 gap-4 max-w-[900px]")}>
            <div className="mx-auto shadow-2xl p-4">
                <div className={cn('flex m-auto py-4')}>
                    <SongEditorWrapper  song={song} />
                </div>
            </div>
        </Container>

    );
}