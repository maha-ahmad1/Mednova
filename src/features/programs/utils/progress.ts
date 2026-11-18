import type { ProgramVideo, ProgramVideoProgress } from "../types/program";

/** Matches the backend rule: a video counts as completed at 90% watched. */
export const COMPLETION_RATIO = 0.9;

// Below this we treat the video as "not started" instead of resuming a few seconds in.
const MIN_RESUME_SECONDS = 5;

export const isProgressCompleted = (progress?: ProgramVideoProgress | null): boolean =>
  Boolean(progress?.is_completed ?? progress?.completed);

/** Where playback should start: the saved second, unless the video is finished or barely started. */
export const getResumePosition = (progress?: ProgramVideoProgress | null): number => {
  if (!progress || isProgressCompleted(progress)) return 0;
  const position = Math.floor(progress.position_seconds || 0);
  return position >= MIN_RESUME_SECONDS ? position : 0;
};

export const getVideoDurationSeconds = (video: ProgramVideo): number | null =>
  video.duration_seconds ?? (video.duration_minute ? video.duration_minute * 60 : null);

/** "m:ss" or "h:mm:ss". */
export const formatSeconds = (totalSeconds: number): string => {
  const safe = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(safe / 3600);
  const minutes = Math.floor((safe % 3600) / 60);
  const seconds = safe % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return hours > 0 ? `${hours}:${pad(minutes)}:${pad(seconds)}` : `${minutes}:${pad(seconds)}`;
};
