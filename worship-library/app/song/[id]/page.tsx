import { Api } from "@/services/api-client";
import {Container} from "@/components/shared";
import {cn} from "@/lib/utils";
import {InputGroup, InputGroupTextarea, AudioPlayer, SongEditor} from "@/components/ui";
import SongEditorWrapper from "@/app/song/[id]/SongEditorWrapper";


export default async function SongPage({params}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params;
    const song = await Api.songs.getById(Number(id));
    
    return (
        <Container className={cn("flex mx-auto py-1 px-5 gap-4 max-w-[900px]")}>
            <div className="mx-auto py-20 ">
                <div className={cn("sticky top-1 z-10")}>
                    <div className={cn('py-1')}>
                        {song.audioUrl && (
                            <AudioPlayer title={song.songTitle} src={song.audioUrl}/>
                        )}
                    </div>
                </div>
                <div className={cn('flex m-auto py-4')}>
                    <SongEditorWrapper  song={song} />
                </div>
            </div>
        </Container>
        
    );
}