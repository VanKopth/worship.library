"use client";

import { useRef, useState, useEffect } from "react";
import { Slider, SliderPrimitive } from "@/components/ui/slider";
import { Pause, Play } from "lucide-react";
import {cn} from "@/lib/utils";

interface AudioPlayerProps {
    title: string;
    src: string;
}

export function AudioPlayer({ title, src }: AudioPlayerProps) {
    const audioRef = useRef<HTMLAudioElement>(null);

    const whithMusic =Boolean(src); 
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);



    /** Audio listeners */
    useEffect(() => {
        if (!whithMusic) return;

        const audio = audioRef.current;
        if (!audio) return;

        const handleTimeUpdate = () => {
            setProgress(audio.currentTime);
        };

        const handleLoadedMetadata = () => {
            setDuration(audio.duration || 0);
        };

        audio.addEventListener("timeupdate", handleTimeUpdate);
        audio.addEventListener("loadedmetadata", handleLoadedMetadata);

        return () => {
            audio.removeEventListener("timeupdate", handleTimeUpdate);
            audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
        };
    }, [whithMusic]);

    const togglePlay = () => {
        const audio = audioRef.current;
        if (!audio) return;

        if (audio.paused) {
            audio.play();
            setIsPlaying(true);
        } else {
            audio.pause();
            setIsPlaying(false);
        }
    };

    const handleSeek = (values: number[]) => {
        const audio = audioRef.current;
        if (!audio) return;

        audio.currentTime = values[0];
        setProgress(values[0]);
    };

    const formatTime = (time: number) => {
        if (!time || Number.isNaN(time)) return "0:00";
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60)
            .toString()
            .padStart(2, "0");
        return `${minutes}:${seconds}`;
    };

    if (!whithMusic) {
        return (
            <div className="w-full max-w-[900px] mx-auto px-4 py-6 rounded-xl shadow-2xl bg-white/20 backdrop-blur-md backdrop-saturate-150">
                <h1 className="text-3xl font-extrabold text-center">{title}</h1>
            </div>
        );
    }

    return (
        <div className="w-full max-w-[900px] mx-auto px-4 py-6 rounded-xl shadow-2xl bg-white/80 backdrop-blur-xs backdrop-saturate-200">
            <audio ref={audioRef} src={src} preload="metadata" />

            <div className="flex items-center justify-center gap-4 mb-4">
                <h1 className="text-2xl font-extrabold">{title}</h1>
                <button
                    onClick={togglePlay}
                    className="p-2 rounded-lg hover:bg-black/5 transition"
                    aria-label={isPlaying ? "Pause" : "Play"}
                >
                    {isPlaying ? (
                        <Pause size={36} color="#575757" strokeWidth={1.5} />
                    ) : (
                        <Play size={36} color="#575757" strokeWidth={1.5} />
                    )}
                </button>

            </div>

            <div className="w-full">
                <div className="flex justify-between text-xs mb-2">
                    <span>{formatTime(progress)}</span>
                    <span>{formatTime(duration)}</span>
                </div>

                <Slider
                    value={[progress]}
                    max={duration || 0}
                    onValueChange={handleSeek}
                    className="w-full cursor-pointer"
                >
                    <SliderPrimitive.Track >
                        <SliderPrimitive.Range className="bg-gray-300" />
                    </SliderPrimitive.Track>
                    <SliderPrimitive.Thumb />
                </Slider>
            </div>
        </div>
    );
}
