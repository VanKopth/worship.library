"use client";

import { useRef, useState, useEffect } from "react";
import { Slider, SliderPrimitive } from "@/components/ui/slider";
import { Pause, Play } from "lucide-react";

interface AudioPlayerProps {
    title: string;
    src: string;
}

export function AudioPlayer({ title, src }: AudioPlayerProps) {
    const audioRef = useRef<HTMLAudioElement>(null);

    const [mounted, setMounted] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);

    /** Mount guard — ключ до відсутності hydration warning */
    useEffect(() => {
        setMounted(true);
    }, []);

    /** Audio listeners */
    useEffect(() => {
        if (!mounted) return;

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
    }, [mounted]);

    /** Play / Pause */
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

    /** Seek */
    const handleSeek = (values: number[]) => {
        const audio = audioRef.current;
        if (!audio) return;

        audio.currentTime = values[0];
        setProgress(values[0]);
    };

    /** Time formatter */
    const formatTime = (time: number) => {
        if (!time || Number.isNaN(time)) return "0:00";
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60)
            .toString()
            .padStart(2, "0");
        return `${minutes}:${seconds}`;
    };

    /** ⛔️ До mount — стабільний SSR HTML */
    if (!mounted) {
        return (
            <div className="w-full max-w-[900px] mx-auto px-4 py-6 rounded-b-xl shadow-2xl bg-white/50 backdrop-blur-md">
                <h1 className="text-3xl font-extrabold text-center">{title}</h1>
            </div>
        );
    }

    /** ✅ Client-only render */
    return (
        <div className="w-full max-w-[900px] mx-auto px-4 py-6 rounded-b-xl shadow-2xl bg-white/50 backdrop-blur-md backdrop-saturate-150">
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
                    <SliderPrimitive.Track>
                        <SliderPrimitive.Range className="bg-blue-600" />
                    </SliderPrimitive.Track>
                    <SliderPrimitive.Thumb />
                </Slider>
            </div>
        </div>
    );
}
