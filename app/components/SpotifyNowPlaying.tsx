"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type SpotifyPayload = {
  isConfigured: boolean;
  isPlaying?: boolean;
  title?: string;
  artist?: string;
  album?: string;
  albumImageUrl?: string | null;
  songUrl?: string;
  deviceName?: string | null;
  playedAt?: string | null;
  error?: string;
};

type LoadState = "loading" | "ready" | "error";

const REFRESH_INTERVAL_MS = 30000;

const formatCount = (count: number) => (count === 1 ? "one" : count.toString());

const formatRelativeTime = (value: string) => {
  const playedAt = new Date(value).getTime();
  if (Number.isNaN(playedAt)) {
    return "recently";
  }

  const diffMs = Date.now() - playedAt;
  if (diffMs < 60000) {
    return "just now";
  }

  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 60) {
    return `${formatCount(minutes)} minute${minutes === 1 ? "" : "s"} ago`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${formatCount(hours)} hour${hours === 1 ? "" : "s"} ago`;
  }

  const days = Math.floor(hours / 24);
  if (days < 7) {
    return `${formatCount(days)} day${days === 1 ? "" : "s"} ago`;
  }

  const weeks = Math.floor(days / 7);
  if (weeks < 5) {
    return `${formatCount(weeks)} week${weeks === 1 ? "" : "s"} ago`;
  }

  const months = Math.floor(days / 30);
  if (months < 12) {
    return `${formatCount(months)} month${months === 1 ? "" : "s"} ago`;
  }

  const years = Math.floor(days / 365);
  return `${formatCount(years)} year${years === 1 ? "" : "s"} ago`;
};

export default function SpotifyNowPlaying() {
  const [payload, setPayload] = useState<SpotifyPayload | null>(null);
  const [loadState, setLoadState] = useState<LoadState>("loading");
  const [hasTrackChanged, setHasTrackChanged] = useState(false);
  const previousSongUrlRef = useRef<string | null>(null);
  const prefersReducedMotionRef = useRef(false);

  const loadData = async () => {
    try {
      const response = await fetch("/api/spotify", { cache: "no-store" });
      const data = (await response.json()) as SpotifyPayload;

      if (!response.ok || data.error) {
        throw new Error(data.error || "Unable to load Spotify data");
      }

      setPayload(data);
      setLoadState("ready");
    } catch (error) {
      console.error(error);
      setLoadState("error");
    }
  };

  useEffect(() => {
    loadData();
    const interval = window.setInterval(loadData, REFRESH_INTERVAL_MS);

    return () => {
      window.clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) {
      return;
    }

    prefersReducedMotionRef.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
  }, []);

  useEffect(() => {
    if (!payload?.songUrl) {
      previousSongUrlRef.current = null;
      return;
    }

    if (prefersReducedMotionRef.current) {
      previousSongUrlRef.current = payload.songUrl;
      return;
    }

    if (
      previousSongUrlRef.current &&
      previousSongUrlRef.current !== payload.songUrl
    ) {
      setHasTrackChanged(true);
      const timeout = window.setTimeout(() => {
        setHasTrackChanged(false);
      }, 400);

      previousSongUrlRef.current = payload.songUrl;

      return () => {
        window.clearTimeout(timeout);
      };
    }

    previousSongUrlRef.current = payload.songUrl;
  }, [payload?.songUrl]);

  const statusLabel = useMemo(() => {
    if (!payload || payload.isPlaying) {
      return "Listening";
    }

    if (payload.playedAt) {
      return `${formatRelativeTime(payload.playedAt)}`;
    }

    return "Played recently";
  }, [payload]);

  if (loadState === "loading") {
    return (
      <div className="mt-8 rounded-2xl border border-neutral-200 bg-white/70 p-4 shadow-sm">
        <div className="h-24 animate-pulse rounded-xl bg-neutral-100" />
      </div>
    );
  }

  if (loadState === "error") {
    return (
      <div className="mt-8 rounded-2xl border border-neutral-200 bg-white/70 text-sm text-neutral-500 shadow-sm">
        Spotify is taking a quick breather. Check back in a moment.
      </div>
    );
  }

  if (!payload?.isConfigured) {
    return (
      <div className="mt-8 rounded-2xl border border-neutral-200 bg-white/70 p-4 text-sm text-neutral-500 shadow-sm">
        Add your Spotify keys to show the latest track here.
      </div>
    );
  }

  const hasTrack = Boolean(payload.title && payload.songUrl);

  if (!hasTrack) {
    return (
      <div className="mt-8 rounded-2xl border border-neutral-200 bg-white/70 p-4 text-sm text-neutral-500 shadow-sm">
        No Spotify activity to show yet.
      </div>
    );
  }

  return (
    <div
      className={`mt-8 group will-change-auto rounded-2xl blur-0 border-neutral-200 bg-neutral-50 p-4 transition-transform duration-300 ${
        hasTrackChanged ? "scale-[1.05] blur-sm" : ""
      }`}
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex items-center gap-4 w-full">
          <a
            href={payload.songUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="relative block h-24 w-24 shadow-md shrink-0 overflow-hidden rounded-lg border-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            aria-label={`Open ${payload.title} on Spotify`}
          >
            {payload.albumImageUrl ? (
              <img
                src={payload.albumImageUrl}
                alt={payload.album ?? payload.title}
                className="h-full transition-all w-full object-cover"
              />
            ) : (
              <div className="h-full w-full bg-neutral-100" />
            )}
          </a>
          <div className="space-y-2 min-w-0">
            <div className="flex flex-col items-start gap-0">
              <a
                href={payload.songUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block max-w-full truncate text-base font-semibold text-neutral-900 transition-colors hover:text-emerald-600"
              >
                {payload.title}
              </a>
              <p className="truncate text-sm text-neutral-500 w-full">
                {payload.artist}
                {payload.album && payload.album !== payload.title
                  ? ` · ${payload.album}`
                  : ""}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs font-medium pt-1">
              {payload.isPlaying ? (
                <span className="inline-flex text-xs tracking-tight items-center gap-2 rounded-full text-neutral-400">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-70" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                  </span>
                  {statusLabel}
                  {payload.isPlaying && payload.deviceName
                    ? ` on ${payload.deviceName}`
                    : ""}
                </span>
              ) : (
                <span className="rounded-full font-medium text-xs text-emerald-400">
                  {statusLabel}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex absolute right-4 bg-neutral-50 pl-2 pb-2 rounded-full items-center gap-2 text-xs text-neutral-400">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/2/26/Spotify_logo_with_text.svg"
            alt="Spotify"
            className="h-6 w-full grayscale antialiased"
          />
        </div>
      </div>
    </div>
  );
}
