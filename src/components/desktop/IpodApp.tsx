"use client";

import {
  type PointerEvent as ReactPointerEvent,
  type RefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

const PUBLIC_IPOD_LIBRARY_URL =
  "https://raw.githubusercontent.com/ryokun6/ryos/main/public/data/ipod-videos.json";
const YOUTUBE_API_SCRIPT_ID = "youtube-iframe-api";
const YOUTUBE_IFRAME_API_URL = "https://www.youtube.com/iframe_api";
const DEFAULT_VOLUME = 72;
const PROGRESS_POLL_MS = 500;
const CLOSE_REVEAL_DISTANCE = 78;
const WHEEL_SEEK_SECONDS_PER_ROTATION = 240;
const PLAYER_STATE_ENDED = 0;
const PLAYER_STATE_PLAYING = 1;
const PLAYER_STATE_PAUSED = 2;

type IpodView = "menu" | "songs" | "nowPlaying" | "about";

interface IpodTrack {
  youtubeId: string;
  url: string;
  title: string;
  artist: string;
  album?: string;
}

interface PlaybackProgress {
  currentTime: number;
  duration: number;
}

interface IpodAppProps {
  onClose?: () => void;
  onDragStart?: (event: ReactPointerEvent<HTMLDivElement>) => void;
}

interface YouTubePlayer {
  cueVideoById: (videoId: string) => void;
  destroy: () => void;
  getCurrentTime: () => number;
  getDuration: () => number;
  loadVideoById: (videoId: string) => void;
  pauseVideo: () => void;
  playVideo: () => void;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  setVolume: (volume: number) => void;
}

interface YouTubePlayerReadyEvent {
  target: YouTubePlayer;
}

interface YouTubePlayerStateEvent {
  data: number;
}

interface YouTubePlayerOptions {
  events: {
    onReady: (event: YouTubePlayerReadyEvent) => void;
    onStateChange: (event: YouTubePlayerStateEvent) => void;
  };
  height: string;
  playerVars: Record<string, number | string>;
  videoId: string;
  width: string;
}

interface YouTubeNamespace {
  Player: new (element: HTMLElement, options: YouTubePlayerOptions) => YouTubePlayer;
}

declare global {
  interface Window {
    YT?: YouTubeNamespace;
    onYouTubeIframeAPIReady?: () => void;
  }
}

let youtubeApiPromise: Promise<void> | null = null;

const fallbackTracks: readonly IpodTrack[] = [
  {
    youtubeId: "D1QVkuEzxNk",
    url: "https://www.youtube.com/watch?v=D1QVkuEzxNk",
    title: "まどろみ",
    artist: "具島直子",
  },
  {
    youtubeId: "h4Q8r60ojSo",
    url: "https://www.youtube.com/watch?v=h4Q8r60ojSo",
    title: "抱きしめて",
    artist: "BENI",
  },
  {
    youtubeId: "QLHMhVonF-s",
    url: "https://www.youtube.com/watch?v=QLHMhVonF-s",
    title: "黄昏のBAY CITY",
    artist: "八神純子",
  },
  {
    youtubeId: "kKsivrgoyDw",
    url: "https://www.youtube.com/watch?v=kKsivrgoyDw",
    title: "Cool with You",
    artist: "NewJeans",
  },
  {
    youtubeId: "T6YVgEpRU6Q",
    url: "https://www.youtube.com/watch?v=T6YVgEpRU6Q",
    title: "LEFT RIGHT",
    artist: "XG",
  },
];

const mainMenuItems: readonly { label: string; view: IpodView }[] = [
  { label: "Now Playing", view: "nowPlaying" },
  { label: "Songs", view: "songs" },
  { label: "Library Info", view: "about" },
];

function loadYouTubeIframeApi() {
  if (window.YT?.Player) {
    return Promise.resolve();
  }

  if (youtubeApiPromise) {
    return youtubeApiPromise;
  }

  youtubeApiPromise = new Promise<void>((resolve) => {
    const previousReadyHandler = window.onYouTubeIframeAPIReady;

    window.onYouTubeIframeAPIReady = () => {
      previousReadyHandler?.();
      resolve();
    };

    if (!document.getElementById(YOUTUBE_API_SCRIPT_ID)) {
      const script = document.createElement("script");
      script.id = YOUTUBE_API_SCRIPT_ID;
      script.src = YOUTUBE_IFRAME_API_URL;
      document.head.appendChild(script);
    }
  });

  return youtubeApiPromise;
}

function readString(value: unknown, fallback = "") {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function parseYouTubeId(url: string) {
  try {
    const parsedUrl = new URL(url);

    if (parsedUrl.hostname.includes("youtu.be")) {
      return parsedUrl.pathname.replace("/", "") || null;
    }

    return parsedUrl.searchParams.get("v");
  } catch {
    return null;
  }
}

function normalizeTracks(payload: unknown): IpodTrack[] {
  if (!payload || typeof payload !== "object") {
    return [];
  }

  const videos = (payload as { videos?: unknown }).videos;
  if (!Array.isArray(videos)) {
    return [];
  }

  const tracks: IpodTrack[] = [];

  videos.forEach((video) => {
    if (!video || typeof video !== "object") {
      return;
    }

    const record = video as Record<string, unknown>;
    const rawId = readString(record.id);
    const rawUrl = readString(record.url);
    const url = rawUrl || (rawId ? `https://www.youtube.com/watch?v=${rawId}` : "");
    const youtubeId =
      parseYouTubeId(url) ?? (/^[a-zA-Z0-9_-]{6,}$/.test(rawId) ? rawId : "");

    if (!youtubeId) {
      return;
    }

    tracks.push({
      youtubeId,
      url: `https://www.youtube.com/watch?v=${youtubeId}`,
      title: readString(record.title, "Untitled Track"),
      artist: readString(record.artist, "Unknown Artist"),
      album: readString(record.album),
    });
  });

  return tracks;
}

function getThumbnailUrl(track: IpodTrack) {
  return `https://i.ytimg.com/vi/${track.youtubeId}/mqdefault.jpg`;
}

function wrapIndex(index: number, length: number) {
  return ((index % length) + length) % length;
}

function normalizeAngleDelta(delta: number) {
  let nextDelta = delta;

  while (nextDelta > Math.PI) nextDelta -= Math.PI * 2;
  while (nextDelta < -Math.PI) nextDelta += Math.PI * 2;

  return nextDelta;
}

function formatPlaybackTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds <= 0) {
    return "0:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${minutes}:${remainingSeconds}`;
}

interface ScreenProps {
  currentTrack: IpodTrack;
  isPlaying: boolean;
  libraryStatus: string;
  menuIndex: number;
  playerMountRef: RefObject<HTMLDivElement | null>;
  progressLabel: string;
  progressPercent: number;
  selectedIndex: number;
  tracks: readonly IpodTrack[];
  view: IpodView;
  onOpenMenuView: (view: IpodView, index: number) => void;
  onOpenTrack: (index: number) => void;
}

function IpodScreen({
  currentTrack,
  isPlaying,
  libraryStatus,
  menuIndex,
  playerMountRef,
  progressLabel,
  progressPercent,
  selectedIndex,
  tracks,
  view,
  onOpenMenuView,
  onOpenTrack,
}: ScreenProps) {
  return (
    <div className="relative h-[248px] w-full overflow-hidden rounded-[18px] border-[3px] border-stone-700 bg-[#dbe6ce] font-[system-ui] text-stone-950 shadow-[inset_0_0_18px_rgba(0,0,0,0.22)]">
      <div className="flex h-7 items-center justify-between border-b border-stone-700/60 bg-[#c6d4bc] px-3 text-[11px] font-bold">
        <span>iPod</span>
        <span>{isPlaying ? "Playing" : "Paused"}</span>
      </div>

      <div className="relative h-[220px] overflow-hidden">
        {view === "menu" ? (
          <div className="grid h-full grid-cols-[1fr_6px]">
            <div className="py-2">
              {mainMenuItems.map((item, index) => {
                const isSelected = menuIndex === index;

                return (
                  <button
                    key={item.view}
                    type="button"
                    className={`flex h-10 w-full items-center justify-between px-3 text-sm font-bold outline-none focus:outline-none focus-visible:outline-none ${isSelected ? "bg-[#234d73] text-white" : ""}`}
                    onClick={() => onOpenMenuView(item.view, index)}
                  >
                    <span>{item.label}</span>
                    {isSelected ? <span aria-hidden="true">&gt;</span> : null}
                  </button>
                );
              })}
            </div>
            <div className="m-1 rounded-full bg-stone-700/20">
              <div
                className="mx-auto w-1 rounded-full bg-stone-700/60"
                style={{
                  height: `${100 / mainMenuItems.length}%`,
                  transform: `translateY(${menuIndex * 100}%)`,
                }}
              />
            </div>
          </div>
        ) : null}

        {view === "songs" ? (
          <div className="h-full overflow-y-auto py-1">
            {tracks.map((track, index) => {
              const isSelected = selectedIndex === index;

              return (
                <button
                  key={`${track.youtubeId}-${index}`}
                  type="button"
                  className={`flex min-h-11 w-full items-center gap-2 px-3 text-left outline-none focus:outline-none focus-visible:outline-none ${isSelected ? "bg-[#234d73] text-white" : "text-stone-950"}`}
                  onClick={() => onOpenTrack(index)}
                >
                  <span className="w-6 shrink-0 text-xs font-bold">{index + 1}</span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-bold">{track.title}</span>
                    <span className={`block truncate text-[11px] ${isSelected ? "text-white/82" : "text-stone-700"}`}>
                      {track.artist}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        ) : null}

        {view === "nowPlaying" ? (
          <div className="flex h-full flex-col p-3">
            <div className="flex min-h-0 flex-1 items-center gap-3">
              <div
                role="img"
                aria-label={`${currentTrack.title} video thumbnail`}
                className="h-20 w-24 shrink-0 rounded-md border border-stone-700/30 bg-cover bg-center grayscale"
                style={{ backgroundImage: `url(${getThumbnailUrl(currentTrack)})` }}
              />
              <div className="min-w-0">
                <p className="truncate text-[13px] font-bold">{currentTrack.title}</p>
                <p className="mt-1 truncate text-xs text-stone-700">{currentTrack.artist}</p>
                <p className="mt-3 text-[11px] text-stone-700">
                  {selectedIndex + 1} of {tracks.length}
                </p>
              </div>
            </div>
            <div className="mt-2 h-2 rounded-full border border-stone-700/30 bg-[#b7c7ac]">
              <div
                className="h-full rounded-full bg-[#234d73] transition-[width] duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p className="mt-1 text-[10px] font-medium text-stone-700">
              {progressLabel}
            </p>
          </div>
        ) : null}

        {view === "about" ? (
          <div className="flex h-full flex-col justify-center p-4 text-sm">
            <p className="font-bold">iPod Library</p>
            <p className="mt-3 text-xs leading-relaxed text-stone-800">
              This app streams a YouTube-backed playlist without bundling audio
              files into the resume site.
            </p>
            <p className="mt-3 text-xs font-bold">{libraryStatus}</p>
          </div>
        ) : null}

        <div
          className={`pointer-events-none absolute bottom-2 right-2 h-12 w-16 overflow-hidden rounded border border-stone-800 bg-black shadow-sm transition-opacity ${isPlaying ? "opacity-90" : "opacity-0"}`}
          aria-hidden="true"
        >
          <div ref={playerMountRef} className="h-full w-full overflow-hidden" />
        </div>
      </div>
    </div>
  );
}

interface ClickWheelProps {
  isPlaying: boolean;
  onBack: () => void;
  onNext: () => void;
  onPlayPause: () => void;
  onPrevious: () => void;
  onSeekDelta: (deltaSeconds: number) => void;
  onSelect: () => void;
}

const clickWheelButtonClass =
  "absolute select-none rounded text-stone-600 outline-none focus:outline-none focus-visible:outline-none";

function PlaybackIcon({ isPlaying }: { isPlaying: boolean }) {
  if (isPlaying) {
    return (
      <svg
        aria-hidden="true"
        className="h-4 w-4"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <rect x="6" y="4" width="4.5" height="16" rx="1" />
        <rect x="13.5" y="4" width="4.5" height="16" rx="1" />
      </svg>
    );
  }

  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4"
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M7 4.8v14.4c0 .9 1 1.4 1.8.9l10.5-7.2c.7-.5.7-1.5 0-2L8.8 3.9C8 3.4 7 3.9 7 4.8Z" />
    </svg>
  );
}

function ClickWheel({
  isPlaying,
  onBack,
  onNext,
  onPlayPause,
  onPrevious,
  onSeekDelta,
  onSelect,
}: ClickWheelProps) {
  const lastAngleRef = useRef<number | null>(null);

  function getPointerAngle(event: ReactPointerEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    return Math.atan2(event.clientY - centerY, event.clientX - centerX);
  }

  function handleWheelPointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if (event.button !== 0) {
      return;
    }

    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    lastAngleRef.current = getPointerAngle(event);
  }

  function handleWheelPointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    if (lastAngleRef.current === null) {
      return;
    }

    event.preventDefault();
    const nextAngle = getPointerAngle(event);
    const delta = normalizeAngleDelta(nextAngle - lastAngleRef.current);
    lastAngleRef.current = nextAngle;
    onSeekDelta(delta * (WHEEL_SEEK_SECONDS_PER_ROTATION / (Math.PI * 2)));
  }

  function handleWheelPointerEnd(event: ReactPointerEvent<HTMLDivElement>) {
    if (lastAngleRef.current === null) {
      return;
    }

    event.currentTarget.releasePointerCapture(event.pointerId);
    lastAngleRef.current = null;
  }

  return (
    <>
      <div
        className="relative mt-5 h-56 w-56 cursor-grab rounded-full border border-white/80 bg-gradient-to-br from-white via-[#e8e8e4] to-[#cfd2d3] shadow-[inset_0_8px_18px_rgba(255,255,255,0.85),inset_0_-12px_24px_rgba(0,0,0,0.12)] active:cursor-grabbing"
        aria-label="Click wheel seek control"
        onPointerCancel={handleWheelPointerEnd}
        onPointerDown={handleWheelPointerDown}
        onPointerMove={handleWheelPointerMove}
        onPointerUp={handleWheelPointerEnd}
      >
        <button
          type="button"
          className={`${clickWheelButtonClass} left-1/2 top-5 -translate-x-1/2 px-3 py-1 text-xs font-bold`}
          onClick={onBack}
          onPointerDown={(event) => event.stopPropagation()}
        >
          MENU
        </button>
        <button
          type="button"
          aria-label="Previous track"
          className={`${clickWheelButtonClass} left-[18%] top-1/2 -translate-x-1/2 -translate-y-1/2 px-1 py-1 text-lg font-black`}
          onClick={onPrevious}
          onPointerDown={(event) => event.stopPropagation()}
        >
          &lt;&lt;
        </button>
        <button
          type="button"
          aria-label="Next track"
          className={`${clickWheelButtonClass} right-[18%] top-1/2 -translate-y-1/2 translate-x-1/2 px-1 py-1 text-lg font-black`}
          onClick={onNext}
          onPointerDown={(event) => event.stopPropagation()}
        >
          &gt;&gt;
        </button>
        <button
          type="button"
          aria-label={isPlaying ? "Pause track" : "Play track"}
          className={`${clickWheelButtonClass} bottom-5 left-1/2 flex h-7 w-12 -translate-x-1/2 items-center justify-center`}
          onClick={onPlayPause}
          onPointerDown={(event) => event.stopPropagation()}
        >
          <PlaybackIcon isPlaying={isPlaying} />
        </button>
        <button
          type="button"
          className="absolute left-1/2 top-1/2 flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 select-none items-center justify-center rounded-full border border-stone-300 bg-gradient-to-br from-[#f7f7f5] to-[#d8dad7] text-xs font-bold text-stone-600 shadow-[inset_0_6px_12px_rgba(255,255,255,0.72),0_8px_20px_rgba(0,0,0,0.12)] outline-none focus:outline-none focus-visible:outline-none"
          onClick={onSelect}
          onPointerDown={(event) => event.stopPropagation()}
        >
          SELECT
        </button>
      </div>

      <div className="mt-3 w-full max-w-[260px] font-[system-ui]">
        <p className="text-center text-[11px] font-semibold text-stone-500">
          Drag around the click wheel to scrub. Clockwise fast-forwards;
          counter-clockwise reverses.
        </p>
      </div>
    </>
  );
}

export function IpodApp({ onClose, onDragStart }: IpodAppProps) {
  const playerMountRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<YouTubePlayer | null>(null);
  const [tracks, setTracks] = useState<readonly IpodTrack[]>(fallbackTracks);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [menuIndex, setMenuIndex] = useState(0);
  const [view, setView] = useState<IpodView>("menu");
  const [isPlaying, setIsPlaying] = useState(false);
  const [playerReady, setPlayerReady] = useState(false);
  const [progress, setProgress] = useState<PlaybackProgress>({
    currentTime: 0,
    duration: 0,
  });
  const seekTargetRef = useRef(0);
  const volume = DEFAULT_VOLUME;
  const [libraryStatus, setLibraryStatus] = useState("Syncing playlist...");
  const [isCloseVisible, setIsCloseVisible] = useState(false);
  const screenShellRef = useRef<HTMLDivElement | null>(null);

  const currentTrack = tracks[selectedIndex] ?? fallbackTracks[0];
  const trackCount = tracks.length;
  const currentTrackRef = useRef(currentTrack);
  const isPlayingRef = useRef(isPlaying);
  const tracksRef = useRef(tracks);
  const volumeRef = useRef(volume);

  const progressPercent = useMemo(() => {
    if (progress.duration <= 0) {
      return 0;
    }

    return Math.min(100, Math.max(0, (progress.currentTime / progress.duration) * 100));
  }, [progress]);

  const progressLabel = useMemo(() => {
    if (progress.duration <= 0) {
      return isPlaying ? "Loading progress..." : "0:00 / 0:00";
    }

    return `${formatPlaybackTime(progress.currentTime)} / ${formatPlaybackTime(progress.duration)}`;
  }, [isPlaying, progress]);

  useEffect(() => {
    currentTrackRef.current = currentTrack;
  }, [currentTrack]);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    tracksRef.current = tracks;
  }, [tracks]);

  useEffect(() => {
    volumeRef.current = volume;
  }, [volume]);

  useEffect(() => {
    let isMounted = true;

    async function initializePlayer() {
      await loadYouTubeIframeApi();

      if (!isMounted || !playerMountRef.current || !window.YT?.Player) {
        return;
      }

      playerRef.current = new window.YT.Player(playerMountRef.current, {
        height: "48",
        width: "64",
        videoId: currentTrackRef.current.youtubeId,
        playerVars: {
          controls: 0,
          enablejsapi: 1,
          modestbranding: 1,
          origin: window.location.origin,
          playsinline: 1,
          rel: 0,
        },
        events: {
          onReady: (event) => {
            event.target.setVolume(volumeRef.current);
            event.target.cueVideoById(currentTrackRef.current.youtubeId);
            setPlayerReady(true);
          },
          onStateChange: (event) => {
            if (event.data === PLAYER_STATE_PLAYING) {
              setIsPlaying(true);
            }

            if (event.data === PLAYER_STATE_PAUSED) {
              setIsPlaying(false);
            }

            if (event.data === PLAYER_STATE_ENDED) {
              const nextLength = tracksRef.current.length || fallbackTracks.length;
              setSelectedIndex((current) => wrapIndex(current + 1, nextLength));
              setIsPlaying(true);
            }
          },
        },
      });
    }

    initializePlayer();

    return () => {
      isMounted = false;
      playerRef.current?.destroy();
      playerRef.current = null;
      setPlayerReady(false);
    };
  }, []);

  useEffect(() => {
    let isActive = true;

    async function loadPlaylistLibrary() {
      try {
        const response = await fetch(PUBLIC_IPOD_LIBRARY_URL);
        if (!response.ok) {
          throw new Error("Could not load iPod library.");
        }

        const nextTracks = normalizeTracks(await response.json());
        if (!isActive || nextTracks.length === 0) {
          return;
        }

        setTracks(nextTracks);
        setSelectedIndex(0);
        setLibraryStatus(`${nextTracks.length} tracks loaded from YouTube.`);
      } catch {
        if (!isActive) {
          return;
        }

        setTracks(fallbackTracks);
        setLibraryStatus("Using the local starter set until the playlist is reachable.");
      }
    }

    loadPlaylistLibrary();

    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    const player = playerRef.current;
    if (!playerReady || !player) {
      return;
    }

    seekTargetRef.current = 0;
    setProgress({ currentTime: 0, duration: 0 });

    if (isPlayingRef.current) {
      player.loadVideoById(currentTrack.youtubeId);
      return;
    }

    player.cueVideoById(currentTrack.youtubeId);
  }, [currentTrack.youtubeId, playerReady]);

  useEffect(() => {
    const player = playerRef.current;
    if (!playerReady || !player) {
      return;
    }

    if (isPlaying) {
      player.playVideo();
      return;
    }

    player.pauseVideo();
  }, [isPlaying, playerReady]);

  useEffect(() => {
    const player = playerRef.current;
    if (!playerReady || !player) {
      return;
    }

    player.setVolume(volume);
  }, [playerReady, volume]);

  useEffect(() => {
    if (!playerReady) {
      return;
    }

    const intervalId = window.setInterval(() => {
      const player = playerRef.current;
      if (!player) {
        return;
      }

      const nextProgress = {
        currentTime: player.getCurrentTime() || 0,
        duration: player.getDuration() || 0,
      };

      seekTargetRef.current = nextProgress.currentTime;
      setProgress(nextProgress);
    }, PROGRESS_POLL_MS);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [currentTrack.youtubeId, playerReady]);

  const openTrack = useCallback((index: number) => {
    setSelectedIndex(index);
    setView("nowPlaying");
    setIsPlaying(true);
  }, []);

  const openMenuView = useCallback((nextView: IpodView, nextMenuIndex: number) => {
    setMenuIndex(nextMenuIndex);
    setView(nextView);
  }, []);

  const moveTrack = useCallback((offset: number) => {
    if (trackCount === 0) {
      return;
    }

    setSelectedIndex((current) => wrapIndex(current + offset, trackCount));
  }, [trackCount]);

  const togglePlayback = useCallback(() => {
    setView("nowPlaying");
    setIsPlaying((current) => !current);
  }, []);

  const seekPlayback = useCallback((deltaSeconds: number) => {
    const player = playerRef.current;

    if (!playerReady || !player) {
      return;
    }

    const duration = player.getDuration() || progress.duration;
    if (duration <= 0) {
      return;
    }

    const currentTime = seekTargetRef.current || player.getCurrentTime() || progress.currentTime;
    const nextTime = Math.min(duration, Math.max(0, currentTime + deltaSeconds));

    seekTargetRef.current = nextTime;
    player.seekTo(nextTime, true);
    setProgress({ currentTime: nextTime, duration });
    setView("nowPlaying");
  }, [playerReady, progress.currentTime, progress.duration]);

  const handleBack = useCallback(() => {
    setView((current) => (current === "menu" ? "nowPlaying" : "menu"));
  }, []);

  const handleNext = useCallback(() => {
    if (view === "songs" || view === "nowPlaying") {
      moveTrack(1);
      return;
    }

    setMenuIndex((current) => wrapIndex(current + 1, mainMenuItems.length));
  }, [moveTrack, view]);

  const handlePrevious = useCallback(() => {
    if (view === "songs" || view === "nowPlaying") {
      moveTrack(-1);
      return;
    }

    setMenuIndex((current) => wrapIndex(current - 1, mainMenuItems.length));
  }, [moveTrack, view]);

  const handleSelect = useCallback(() => {
    if (view === "songs") {
      openTrack(selectedIndex);
      return;
    }

    if (view === "nowPlaying") {
      togglePlayback();
      return;
    }

    if (view === "menu") {
      setView(mainMenuItems[menuIndex]?.view ?? "nowPlaying");
    }
  }, [menuIndex, openTrack, selectedIndex, togglePlayback, view]);

  const handleDevicePointerMove = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const shouldShowClose = event.clientY - rect.top <= CLOSE_REVEAL_DISTANCE;

    setIsCloseVisible((current) => (
      current === shouldShowClose ? current : shouldShowClose
    ));
  }, []);

  const handleDevicePointerDown = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    const screenTop = screenShellRef.current?.getBoundingClientRect().top;

    if (screenTop === undefined || event.clientY >= screenTop) {
      return;
    }

    onDragStart?.(event);
  }, [onDragStart]);

  return (
    <div className="flex h-full w-full items-center justify-center overflow-visible bg-transparent">
      <div
        className="relative flex min-h-[650px] w-full max-w-[350px] flex-col items-center rounded-[42px] border border-white/70 bg-gradient-to-b from-[#f8f8f5] via-[#ececea] to-[#cfd2d4] px-5 py-6 shadow-[0_28px_70px_rgba(15,23,42,0.28),inset_0_3px_6px_rgba(255,255,255,0.82)]"
        onPointerLeave={() => setIsCloseVisible(false)}
        onPointerDown={handleDevicePointerDown}
        onPointerMove={handleDevicePointerMove}
      >
        <button
          type="button"
          aria-label="Close iPod"
          aria-hidden={!isCloseVisible}
          className={`absolute right-4 top-4 z-20 flex h-8 w-8 items-center justify-center rounded-full border border-white/70 bg-white/45 font-[system-ui] text-sm font-bold text-stone-700 shadow-[0_10px_30px_rgba(15,23,42,0.16),inset_0_1px_0_rgba(255,255,255,0.72)] backdrop-blur-xl transition duration-150 outline-none focus:outline-none focus-visible:outline-none ${isCloseVisible ? "scale-100 opacity-100" : "pointer-events-none scale-95 opacity-0"}`}
          tabIndex={isCloseVisible ? 0 : -1}
          onClick={onClose}
          onPointerDown={(event) => event.stopPropagation()}
        >
          X
        </button>

        <div
          className="mb-4 flex w-full cursor-grab touch-none select-none items-center justify-between px-2 font-[system-ui] text-xs font-bold text-stone-500 active:cursor-grabbing"
        >
          <span>Daenon iPod</span>
          <span>{trackCount} songs</span>
        </div>

        <div ref={screenShellRef} className="w-full">
          <IpodScreen
            currentTrack={currentTrack}
            isPlaying={isPlaying}
            libraryStatus={libraryStatus}
            menuIndex={menuIndex}
            playerMountRef={playerMountRef}
            progressLabel={progressLabel}
            progressPercent={progressPercent}
            selectedIndex={selectedIndex}
            tracks={tracks}
            view={view}
            onOpenMenuView={openMenuView}
            onOpenTrack={openTrack}
          />
        </div>

        <ClickWheel
          isPlaying={isPlaying}
          onBack={handleBack}
          onNext={handleNext}
          onPlayPause={togglePlayback}
          onPrevious={handlePrevious}
          onSeekDelta={seekPlayback}
          onSelect={handleSelect}
        />
      </div>
    </div>
  );
}
