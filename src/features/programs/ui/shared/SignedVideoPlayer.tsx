"use client";

import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Loader2, PlayCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { useVideoStream } from "@/features/programs/hooks/useVideoStream";

interface SignedVideoPlayerProps {
  programId: number;
  videoId: number;
  /** Skip everything and let the parent render its own lock overlay instead. */
  isLocked?: boolean;
  poster?: string | null;
  className?: string;
}

// Max consecutive link refreshes after a <video> error — stops an infinite loop
// if the error isn't actually an expired link.
const MAX_REFRESH_ATTEMPTS = 2;

type PlayerError = "auth" | "generic";

// Shared by the patient-facing course page and the admin review page. The signed URL
// (valid 10 min) is requested only when the user presses play — never on mount — and is
// never cached. If playback errors (expired link), it keeps the current second in a ref,
// requests a fresh link (bounded retries) and resumes from the same position.
export function SignedVideoPlayer({
  programId,
  videoId,
  isLocked = false,
  poster,
  className,
}: SignedVideoPlayerProps) {
  const t = useTranslations("programs.player");
  const { mutateAsync: fetchStream } = useVideoStream();
  const [streamUrl, setStreamUrl] = useState<string | null>(null);
  const [error, setError] = useState<PlayerError | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const savedTimeRef = useRef(0);
  const refreshAttemptsRef = useRef(0);
  // Incremented on video change/unmount so a late response for an old video is ignored.
  const requestIdRef = useRef(0);

  useEffect(() => {
    requestIdRef.current += 1;
    savedTimeRef.current = 0;
    refreshAttemptsRef.current = 0;
    setStreamUrl(null);
    setError(null);
    setIsLoading(false);

    return () => {
      requestIdRef.current += 1;
    };
  }, [programId, videoId]);

  const loadStream = async (resumeFrom: number) => {
    const requestId = ++requestIdRef.current;
    setIsLoading(true);
    setError(null);

    try {
      const stream = await fetchStream({ programId, videoId });
      if (requestId !== requestIdRef.current) return;
      savedTimeRef.current = resumeFrom;
      setStreamUrl(stream.url);
    } catch (err) {
      if (requestId !== requestIdRef.current) return;
      const status = axios.isAxiosError(err) ? err.response?.status : undefined;
      setStreamUrl(null);
      setError(status === 401 || status === 403 ? "auth" : "generic");
    } finally {
      if (requestId === requestIdRef.current) setIsLoading(false);
    }
  };

  if (isLocked) {
    return null;
  }

  const handleVideoError = () => {
    if (refreshAttemptsRef.current >= MAX_REFRESH_ATTEMPTS) {
      setStreamUrl(null);
      setError("generic");
      return;
    }
    refreshAttemptsRef.current += 1;
    loadStream(savedTimeRef.current);
  };

  if (error) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center gap-2 bg-gray-900 p-4 text-center text-white",
          className,
        )}
      >
        <p className="text-sm">{error === "auth" ? t("authRequired") : t("failed")}</p>
        {error === "generic" && (
          <button
            type="button"
            className="cursor-pointer text-xs underline"
            onClick={() => {
              refreshAttemptsRef.current = 0;
              loadStream(savedTimeRef.current);
            }}
          >
            {t("retry")}
          </button>
        )}
      </div>
    );
  }

  if (!streamUrl) {
    return (
      <div
        className={cn("relative flex items-center justify-center bg-gray-900", className)}
        style={
          poster
            ? { backgroundImage: `url(${poster})`, backgroundSize: "cover", backgroundPosition: "center" }
            : undefined
        }
      >
        {isLoading ? (
          <Loader2 className="h-8 w-8 animate-spin text-white/70" />
        ) : (
          <button
            type="button"
            aria-label={t("play")}
            className="cursor-pointer rounded-full bg-black/50 p-2 text-white transition hover:bg-black/70"
            onClick={() => {
              refreshAttemptsRef.current = 0;
              loadStream(0);
            }}
          >
            <PlayCircle className="h-14 w-14" />
          </button>
        )}
      </div>
    );
  }

  return (
    <video
      key={streamUrl}
      src={streamUrl}
      controls
      autoPlay
      poster={poster || undefined}
      className={className}
      onTimeUpdate={(event) => {
        savedTimeRef.current = event.currentTarget.currentTime;
      }}
      onLoadedMetadata={(event) => {
        if (savedTimeRef.current > 0) {
          event.currentTarget.currentTime = savedTimeRef.current;
        }
        event.currentTarget.play().catch(() => {});
      }}
      onPlaying={() => {
        refreshAttemptsRef.current = 0;
      }}
      onError={handleVideoError}
    />
  );
}
