"use client";

import { useEffect, useRef, useState } from "react";

export default function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement>(null);

  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) return;

    audio.volume = 0.45;

    const savedMute = localStorage.getItem("sojho-muted");

    if (savedMute !== null) {
      const isMuted = savedMute === "false";

      setMuted(isMuted);
      audio.muted = isMuted;
    } else {
      audio.muted = true;
    }

    const startMusic = () => {
      audio.play().catch(() => {});
    };

    // Try immediately
    startMusic();

    // Browsers may require user interaction before playing audio
    document.addEventListener("click", startMusic);
    document.addEventListener("keydown", startMusic);

    return () => {
      document.removeEventListener("click", startMusic);
      document.removeEventListener("keydown", startMusic);
    };
  }, []);

  const toggleMute = () => {
    const audio = audioRef.current;

    if (!audio) return;

    const nextMuted = !muted;

    setMuted(nextMuted);
    audio.muted = nextMuted;

    localStorage.setItem("sojho-muted", String(nextMuted));

    if (!nextMuted) {
      audio.play().catch(() => {});
    }
  };

  return (
    <>
      <audio ref={audioRef} loop preload="auto">
        <source src="/Title.mp3" type="audio/mpeg" />
      </audio>

      <button
        type="button"
        onClick={toggleMute}
        aria-label={muted ? "Turn sound on" : "Mute sound"}
        className="
    fixed
    bottom-4
    left-4
    z-[100]

    flex
    h-10
    w-10
    items-center
    justify-center

    border-2
    border-[#17151a]
    bg-[#fffdf8]

    font-display
    text-sm
    text-[#17151a]

    shadow-[3px_3px_0_#17151a]

    transition-all

    hover:bg-[#f7c948]

    active:translate-x-[2px]
    active:translate-y-[2px]
    active:shadow-[1px_1px_0_#17151a]

    sm:h-auto
    sm:w-auto
    sm:gap-2
    sm:px-4
    sm:py-2.5
    sm:text-[11px]
    sm:uppercase
    sm:tracking-[0.14em]
  "
      >
        <span className="leading-none">{muted ? "×" : "♪"}</span>

        <span className="hidden sm:inline">
          {muted ? "Sound off" : "Sound on"}
        </span>
      </button>
    </>
  );
}
