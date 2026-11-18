"use client";

import { useCallback, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useLocale } from "next-intl";
import { useAxiosInstance } from "@/lib/axios/axiosInstance";
import { sendVideoProgressKeepalive, updateVideoProgress } from "../api";
import { COMPLETION_RATIO } from "../utils/progress";
import type { ProgramVideoProgress } from "../types/program";

const SAVE_INTERVAL_MS = 15_000;

interface UseVideoProgressTrackerArgs {
  programId: number;
  videoId: number | null;
  /** Only enrolled users have progress; never send for guests or locked videos. */
  enabled: boolean;
  /** Keeps the page's ✓ / progress bar in sync without refetching the program. */
  onLocalProgress?: (videoId: number, progress: ProgramVideoProgress) => void;
}

export interface VideoProgressHandlers {
  onTimeUpdate: (currentTime: number, duration: number) => void;
  onPlay: () => void;
  onPause: (currentTime: number) => void;
  onEnded: (currentTime: number) => void;
}

/**
 * Saves the watch position: every ~15s while playing, on pause/end, and one last time
 * (fetch keepalive) when the video changes, the user navigates away or the tab is closed.
 */
export function useVideoProgressTracker({
  programId,
  videoId,
  enabled,
  onLocalProgress,
}: UseVideoProgressTrackerArgs): VideoProgressHandlers {
  const axiosInstance = useAxiosInstance();
  const { data: session } = useSession();
  const locale = useLocale();

  // Refs so the unload/cleanup paths always see the latest values without re-subscribing.
  const tokenRef = useRef(session?.accessToken);
  const localeRef = useRef(locale);
  const axiosRef = useRef(axiosInstance);
  const onLocalProgressRef = useRef(onLocalProgress);
  const positionRef = useRef<number | null>(null);
  const durationRef = useRef(0);
  const lastSentRef = useRef<number | null>(null);
  const isPlayingRef = useRef(false);

  useEffect(() => {
    tokenRef.current = session?.accessToken;
    localeRef.current = locale;
    axiosRef.current = axiosInstance;
    onLocalProgressRef.current = onLocalProgress;
  });

  const save = useCallback(
    (mode: "normal" | "keepalive", forceCompleted = false) => {
      const position = positionRef.current;
      if (!enabled || videoId === null || position === null) return;

      const seconds = Math.floor(position);
      const duration = durationRef.current;
      const isCompleted =
        forceCompleted || (duration > 0 && position / duration >= COMPLETION_RATIO);

      // Local state first, so the ✓ appears even if the request is slow.
      onLocalProgressRef.current?.(videoId, {
        position_seconds: seconds,
        ...(isCompleted ? { is_completed: true } : {}),
      });

      if (lastSentRef.current === seconds) return;
      lastSentRef.current = seconds;

      if (mode === "keepalive") {
        sendVideoProgressKeepalive({
          programId,
          videoId,
          positionSeconds: seconds,
          token: tokenRef.current,
          locale: localeRef.current,
        });
        return;
      }

      updateVideoProgress(axiosRef.current, programId, videoId, seconds).catch(() => {
        // Allow the next tick to retry the same second.
        lastSentRef.current = null;
      });
    },
    [enabled, programId, videoId],
  );

  // Per video: periodic save while playing + final keepalive save when this video is left
  // (another video selected, SPA navigation away, component unmount).
  useEffect(() => {
    positionRef.current = null;
    durationRef.current = 0;
    lastSentRef.current = null;
    isPlayingRef.current = false;

    if (!enabled || videoId === null) return;

    const interval = window.setInterval(() => {
      if (isPlayingRef.current) save("normal");
    }, SAVE_INTERVAL_MS);

    const handlePageHide = () => save("keepalive");
    const handleVisibility = () => {
      if (document.visibilityState === "hidden") save("keepalive");
    };
    window.addEventListener("pagehide", handlePageHide);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      window.clearInterval(interval);
      window.removeEventListener("pagehide", handlePageHide);
      document.removeEventListener("visibilitychange", handleVisibility);
      save("keepalive");
    };
  }, [enabled, videoId, save]);

  const onTimeUpdate = useCallback((currentTime: number, duration: number) => {
    positionRef.current = currentTime;
    if (Number.isFinite(duration) && duration > 0) durationRef.current = duration;
  }, []);

  const onPlay = useCallback(() => {
    isPlayingRef.current = true;
  }, []);

  const onPause = useCallback(
    (currentTime: number) => {
      isPlayingRef.current = false;
      positionRef.current = currentTime;
      save("normal");
    },
    [save],
  );

  const onEnded = useCallback(
    (currentTime: number) => {
      isPlayingRef.current = false;
      positionRef.current = currentTime;
      save("normal", true);
    },
    [save],
  );

  return { onTimeUpdate, onPlay, onPause, onEnded };
}
