'use client';

import { useRef, useState, useEffect } from "react";
import { Slider, SliderPrimitive} from "@/components/ui/slider";
import {Pause, Play} from "lucide-react"; // ShadCN Slider


interface AudioPlayerProps {
    title: string;
    src: string;
}

function AudioPlayer({title, src }: AudioPlayerProps) {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);

    // Play / Pause
    const togglePlay = () => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    // Update progress
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const updateProgress = () => {
            setProgress(audio.currentTime);
        };

        const setAudioDuration = () => {
            setDuration(audio.duration || 0);
        };

        audio.addEventListener("timeupdate", updateProgress);
        audio.addEventListener("loadedmetadata", setAudioDuration);

        return () => {
            audio.removeEventListener("timeupdate", updateProgress);
            audio.removeEventListener("loadedmetadata", setAudioDuration);
        };
    }, []);

    // Seek audio
    const handleSeek = (values: number[]) => {
        if (audioRef.current) {
            audioRef.current.currentTime = values[0];
            setProgress(values[0]);
        }
    };

    // Format time
    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60)
            .toString()
            .padStart(2, "0");
        return `${minutes}:${seconds}`;
    };

    return (
        <div className="flex  flex-col items-center w-full max-w-900px pb-5 px-4 text-black rounded-lg shadow-2xl">
            <h1 className="text-3xl font-bold mb-4">{title}</h1>
            <audio ref={audioRef} src={src} />

            <button onClick={togglePlay} className="px-4 py-0 rounded-lg cursor-pointer">
                {isPlaying ? <Pause size={20} color="#575757" strokeWidth={1} absoluteStrokeWidth /> : 
                <Play size={20} color="#575757" strokeWidth={1} absoluteStrokeWidth />}
            </button>

            <div className="w-full">
                <div className="flex justify-between text-xs mb-2 cursor-pointer">
                    <span>{formatTime(progress)}</span>
                    <span>{formatTime(duration)}</span>
                </div>
                <Slider
                    value={[progress]}     // <-- важливо: value, а не defaultValue
                    max={duration}
                    onValueChange={handleSeek}
                    className="w-full cursor-pointer"
                >
                    <SliderPrimitive.Track>
                        <SliderPrimitive.Range className="bg-blue-600" />
                    </SliderPrimitive.Track>
                    <SliderPrimitive.Thumb />
                </Slider>
            </div>
        </div>
    );
}
export {AudioPlayer};
