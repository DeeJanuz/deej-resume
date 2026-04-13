"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { AmbientTrack } from "@/types";
import {
  computeVisualSeed,
  getInitials,
  mixHex,
  toRgba,
} from "@/components/content/sectionVisualUtils";

const COLLAPSED_STORAGE_KEY = "resume-site-ambient-player-collapsed";
const PLAYBACK_STORAGE_KEY = "resume-site-ambient-player-last-playing";

interface AmbientPlayerProps {
  track: AmbientTrack;
}

function readStorageBoolean(key: string, fallback: boolean) {
  try {
    const value = window.localStorage.getItem(key);
    if (value === null) {
      return fallback;
    }
    return value === "true";
  } catch {
    return fallback;
  }
}

function writeStorageBoolean(key: string, value: boolean) {
  try {
    window.localStorage.setItem(key, String(value));
  } catch {
    // Ignore storage write failures so the player still works in private browsing.
  }
}

function Artwork({ track }: { track: AmbientTrack }) {
  const seed = computeVisualSeed(`${track.title}:${track.artist}`);
  const accent = "#2d5f93";
  const base = mixHex(accent, "#f5efe5", 0.74);
  const deep = mixHex(accent, "#111827", 0.36);
  const initials = getInitials(track.title);
  const rotation = (seed % 16) - 8;

  return (
    <div
      role="img"
      aria-label={track.artworkAlt}
      className="relative h-14 w-14 overflow-hidden rounded-[18px] border border-white/55 shadow-[0_12px_24px_rgba(15,23,42,0.16)]"
      style={{ background: `linear-gradient(145deg, ${base} 0%, ${deep} 100%)` }}
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: [
            `radial-gradient(circle at 24% 22%, ${toRgba("#ffffff", 0.56)} 0, ${toRgba("#ffffff", 0)} 42%)`,
            `radial-gradient(circle at 78% 28%, ${toRgba("#8fb9d7", 0.34)} 0, ${toRgba("#8fb9d7", 0)} 44%)`,
            `linear-gradient(135deg, ${toRgba("#ffffff", 0.1)} 0%, ${toRgba("#ffffff", 0)} 65%)`,
          ].join(", "),
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `repeating-linear-gradient(120deg, ${toRgba("#ffffff", 0.12)} 0 2px, transparent 2px 18px)`,
          transform: `scale(1.15) rotate(${rotation}deg)`,
        }}
      />
      <div className="absolute bottom-2 left-2 font-display text-2xl leading-none tracking-[-0.06em] text-white/82">
        {initials || "DJ"}
      </div>
    </div>
  );
}

export function AmbientPlayer({ track }: AmbientPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const hasLoadedPreferences = useRef(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      hasLoadedPreferences.current = true;
      setIsCollapsed(readStorageBoolean(COLLAPSED_STORAGE_KEY, false));
    });

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, []);

  useEffect(() => {
    if (!hasLoadedPreferences.current) {
      return;
    }
    writeStorageBoolean(COLLAPSED_STORAGE_KEY, isCollapsed);
  }, [isCollapsed]);

  useEffect(() => {
    if (!hasLoadedPreferences.current) {
      return;
    }
    writeStorageBoolean(PLAYBACK_STORAGE_KEY, isPlaying);
  }, [isPlaying]);

  const equalizerBars = useMemo(() => [0, 1, 2], []);

  async function togglePlayback() {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      return;
    }

    try {
      await audio.play();
      setIsPlaying(true);
    } catch {
      setIsPlaying(false);
    }
  }

  function handleAudioPause() {
    setIsPlaying(false);
  }

  function handleAudioPlay() {
    setIsPlaying(true);
  }

  return (
    <div className="fixed bottom-5 right-5 z-[60]">
      <audio
        ref={audioRef}
        src={track.src}
        loop
        preload="metadata"
        onPause={handleAudioPause}
        onPlay={handleAudioPlay}
      />

      <div className="glass-panel overflow-hidden rounded-[24px] border-white/45">
        <div className="flex items-center gap-3 px-3 py-3">
          <Artwork track={track} />

          {!isCollapsed ? (
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-stone-500">
                Ambient Tape
              </p>
              <p className="mt-1 truncate text-sm font-semibold text-stone-900">
                {track.title}
              </p>
              <p className="mt-1 truncate text-xs text-stone-600">
                {track.artist}
              </p>
              <div className="mt-2 flex items-center gap-1.5">
                {equalizerBars.map((bar) => (
                  <span
                    key={bar}
                    className={`equalizer-bar ${isPlaying ? "is-playing" : ""}`}
                    style={{ animationDelay: `${bar * 120}ms` }}
                  />
                ))}
              </div>
            </div>
          ) : null}

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={togglePlayback}
              aria-label={isPlaying ? "Pause ambient music" : "Play ambient music"}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/55 bg-white/60 text-sm font-semibold text-stone-900 transition hover:-translate-y-0.5 hover:bg-white/72"
            >
              {isPlaying ? "II" : ">"}
            </button>

            <button
              type="button"
              onClick={() => setIsCollapsed((current) => !current)}
              aria-label={isCollapsed ? "Expand ambient player" : "Collapse ambient player"}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/45 bg-white/45 text-lg leading-none text-stone-600 transition hover:bg-white/62"
            >
              {isCollapsed ? "+" : "-"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
