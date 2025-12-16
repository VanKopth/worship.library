import { Api } from "@/services/api-client";
import {SongBody,Container} from "@/components/shared";
import {cn} from "@/lib/utils";
import {AudioPlayer} from "@/components/ui";


export default async function SongPage({params}: {
    params: { id: string }
}) {
    const { id } = await params;
    const song = await Api.songs.getById(Number(id));
    const  songAudioUrl = song.audioUrl; 
    
    return (
            <div className="flex-col mx-auto py-5 px-2 max-w-[900px]">
                <div className={cn("sticky top-0 z-10")}>
                    <div>
                        <AudioPlayer title={song.songTitle as string} src={songAudioUrl as string} />
                    </div>
                </div>
                <div className={cn("py-10 z-10 px-2")}>
                    <SongBody songBody={song.songText}/>
                </div>
            </div>
    );
}