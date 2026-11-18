"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CheckCircle2, Clock, Lock, PlayCircle, RotateCcw } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import type { ProgramVideo, ProgramVideoProgress } from "@/features/programs/types/program";
import { LockedContentOverlay } from "@/shared/ui/components/LockedContentOverlay";
import { getVideoAccessState } from "@/features/programs/utils/access";
import {
  formatSeconds,
  getResumePosition,
  getVideoDurationSeconds,
  isProgressCompleted,
} from "@/features/programs/utils/progress";
import { useVideoProgressTracker } from "@/features/programs/hooks/useVideoProgressTracker";
import { SignedVideoPlayer } from "@/features/programs/ui/shared/SignedVideoPlayer";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useTranslations } from "next-intl";

interface ProgramVideosProps {
  programId: number;
  videos: ProgramVideo[];
  coverImage?: string | null;
  /** Deep-link target from "برامجي"'s "متابعة المشاهدة" — falls back to the last watched video, then the first. */
  initialVideoId?: number;
  /** Watch progress is tracked for enrolled users only. */
  isEnrolled?: boolean;
  progressPercent?: number | null;
  lastVideoId?: number | null;
}

export function ProgramVideos({
  programId,
  videos,
  coverImage,
  initialVideoId,
  isEnrolled = false,
  progressPercent,
  lastVideoId,
}: ProgramVideosProps) {
  const t = useTranslations("programs.detail");
  const queryClient = useQueryClient();
  const playerRef = useRef<HTMLDivElement>(null);
  const [selectedVideoId, setSelectedVideoId] = useState<number | null>(() => {
    const exists = (id?: number | null) => !!id && videos.some((video) => video.id === id);
    if (exists(initialVideoId)) return initialVideoId as number;
    if (isEnrolled && exists(lastVideoId)) return lastVideoId as number;
    return videos[0]?.id ?? null;
  });
  // Progress saved during this visit, layered over what the program request returned.
  const [localProgress, setLocalProgress] = useState<Record<number, ProgramVideoProgress>>({});
  const [playRequest, setPlayRequest] = useState(0);

  const selectedVideo = useMemo(
    () => videos.find((video) => video.id === selectedVideoId) ?? null,
    [selectedVideoId, videos],
  );
  // Using the shared access helper keeps the locked-state logic consistent across UI elements.
  const selectedAccess = getVideoAccessState(selectedVideo?.is_locked);

  const progressOf = useCallback(
    (video: ProgramVideo): ProgramVideoProgress | null => {
      const local = localProgress[video.id];
      if (!local) return video.progress ?? null;
      // Once completed, stays completed even if the user rewinds.
      const completed = isProgressCompleted(local) || isProgressCompleted(video.progress);
      return { position_seconds: local.position_seconds, ...(completed ? { is_completed: true } : {}) };
    },
    [localProgress],
  );

  const handleLocalProgress = useCallback((videoId: number, progress: ProgramVideoProgress) => {
    setLocalProgress((prev) => {
      const current = prev[videoId];
      if (
        current?.position_seconds === progress.position_seconds &&
        isProgressCompleted(current) === isProgressCompleted(progress)
      ) {
        return prev;
      }
      return { ...prev, [videoId]: progress };
    });
  }, []);

  const tracker = useVideoProgressTracker({
    programId,
    videoId: selectedVideo?.id ?? null,
    enabled: isEnrolled && !!selectedVideo && !selectedAccess.isLocked,
    onLocalProgress: handleLocalProgress,
  });

  // Leaving the page: refresh the program and "برامجي" so they show the new progress.
  useEffect(
    () => () => {
      queryClient.invalidateQueries({ queryKey: ["program", programId] });
      queryClient.invalidateQueries({ queryKey: ["my-courses"] });
    },
    [queryClient, programId],
  );

  const completedCount = videos.filter((video) => isProgressCompleted(progressOf(video))).length;
  // Server value until something changes during this visit, then derived from completed videos.
  const overallPercent =
    Object.keys(localProgress).length > 0 && videos.length > 0
      ? Math.round((completedCount / videos.length) * 100)
      : Math.round(progressPercent ?? 0);

  const continueVideo = useMemo(() => {
    if (!isEnrolled || !lastVideoId) return null;
    const video = videos.find((v) => v.id === lastVideoId);
    if (!video || getVideoAccessState(video.is_locked).isLocked) return null;
    const progress = progressOf(video);
    return getResumePosition(progress) > 0 ? video : null;
  }, [isEnrolled, lastVideoId, videos, progressOf]);

  const handleContinue = () => {
    if (!continueVideo) return;
    setSelectedVideoId(continueVideo.id);
    setPlayRequest((n) => n + 1);
    playerRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  if (!videos || videos.length === 0) {
    return null;
  }

  const selectedProgress = selectedVideo ? progressOf(selectedVideo) : null;
  const showProgressSummary = isEnrolled && (progressPercent != null || completedCount > 0);

  return (
    <div
      id="program-videos"
      className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8"
    >
      <h2 className="text-2xl font-bold text-gray-900 mb-6">{t("content")}</h2>

      {showProgressSummary && (
        <div className="mb-6 space-y-3 rounded-xl border border-[#32A88D]/20 bg-[#32A88D]/5 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-1">
              <p className="text-sm font-semibold text-gray-900">{t("progressTitle")}</p>
              <p className="text-xs text-gray-600">
                {t("progressCompleted", { done: completedCount, total: videos.length })}
              </p>
            </div>
            <span className="text-lg font-bold text-[#32A88D]">{overallPercent}%</span>
          </div>
          <Progress value={overallPercent} aria-label={t("progressTitle")} />
          {continueVideo && (
            <Button
              type="button"
              onClick={handleContinue}
              className="bg-gradient-to-r from-[#32A88D] to-[#2a8a7a] text-white hover:from-[#2a8a7a] hover:to-[#32A88D]"
            >
              <RotateCcw className="me-2 h-4 w-4" />
              {t("continueWatching")}
            </Button>
          )}
        </div>
      )}

      {selectedVideo && (
        <div className="mb-6" ref={playerRef}>
          <LockedContentOverlay
            isLocked={selectedAccess.isLocked}
            className="relative aspect-video rounded-xl mb-4"
            title={t("lockedVideoTitle")}
            description={t("lockedVideoDesc")}
            ctaLabel={t("lockedVideoCta")}
            ctaHref="#program-enrollment"
          >
            {selectedAccess.isLocked ? (
              <div className="flex h-full w-full items-center justify-center bg-gray-900">
                <Image
                  src={coverImage || "/images/placeholder.svg"}
                  alt="Program cover"
                  width={800}
                  height={450}
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
            ) : (
              <SignedVideoPlayer
                programId={programId}
                videoId={selectedVideo.id}
                poster={coverImage}
                className="h-full w-full"
                startAtSeconds={isEnrolled ? getResumePosition(selectedProgress) : 0}
                playRequest={playRequest}
                progress={isEnrolled ? tracker : undefined}
              />
            )}
          </LockedContentOverlay>
          <h3 dir="auto" className="text-xl font-bold text-gray-900 mb-2">
            {selectedVideo.title}
          </h3>
          <p dir="auto" className="text-gray-600 leading-relaxed">
            {selectedVideo.description}
          </p>
        </div>
      )}

      <div className="space-y-3">
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          {t("videoList", { count: videos.length })}
        </h3>
        {videos.map((video, index) => {
          const { isLocked } = getVideoAccessState(video.is_locked);
          const isSelected = selectedVideo?.id === video.id;
          const progress = isEnrolled ? progressOf(video) : null;
          const isCompleted = isProgressCompleted(progress);
          const resumeAt = getResumePosition(progress);
          const durationSeconds = getVideoDurationSeconds(video);
          const watchedPercent =
            durationSeconds && resumeAt > 0
              ? Math.min(100, Math.round((resumeAt / durationSeconds) * 100))
              : 0;

          return (
            <button
              key={video.id}
              onClick={() => setSelectedVideoId(video.id)}
              aria-current={isSelected ? "true" : undefined}
              className={cn(
                "w-full cursor-pointer text-start p-4 rounded-xl border transition-all duration-300",
                isSelected
                  ? "border-[#32A88D] bg-[#32A88D]/5"
                  : "border-gray-200 hover:border-[#32A88D]/50 hover:bg-gray-50",
                isLocked &&
                  "border-amber-200/80 bg-amber-50/50 hover:border-amber-200",
              )}
            >
              <div className="flex items-center gap-4">
                <div
                  className={cn(
                    "w-12 h-12 shrink-0 rounded-lg flex items-center justify-center",
                    isSelected ? "bg-[#32A88D]" : "bg-gray-100",
                    isCompleted && !isSelected && "bg-[#32A88D]/10",
                    isLocked && "bg-amber-100",
                  )}
                >
                  {isLocked ? (
                    <Lock className="w-5 h-5 text-amber-600" />
                  ) : isCompleted ? (
                    <CheckCircle2
                      className={cn("w-6 h-6", isSelected ? "text-white" : "text-[#32A88D]")}
                      aria-label={t("videoCompleted")}
                    />
                  ) : (
                    <PlayCircle
                      className={cn(
                        "w-6 h-6",
                        isSelected ? "text-white" : "text-gray-600",
                      )}
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h4 dir="auto" className="font-bold text-gray-900">
                      {index + 1}. {video.title}
                      {video.is_program_intro ? (
                        <span className="ms-2 inline-block whitespace-nowrap text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                          {t("introVideo")}
                        </span>
                      ) : (
                        video.is_free === true && (
                          <span className="ms-2 inline-block whitespace-nowrap text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                            {t("freeVideo")}
                          </span>
                        )
                      )}
                    </h4>
                    {durationSeconds ? (
                      <div className="flex shrink-0 items-center gap-1 text-sm text-gray-500">
                        <Clock className="w-4 h-4" />
                        <span dir="ltr">{formatSeconds(durationSeconds)}</span>
                      </div>
                    ) : null}
                  </div>
                  <p dir="auto" className="text-sm text-gray-600 line-clamp-2">
                    {video.description}
                  </p>
                  {isCompleted && (
                    <p className="mt-2 text-xs font-semibold text-[#32A88D]">
                      {t("videoCompleted")}
                    </p>
                  )}
                  {!isCompleted && resumeAt > 0 && (
                    <div className="mt-2 space-y-1">
                      <p className="text-xs text-gray-500">
                        {t("stoppedAt")} <span dir="ltr">{formatSeconds(resumeAt)}</span>
                      </p>
                      {watchedPercent > 0 && <Progress value={watchedPercent} className="h-1" />}
                    </div>
                  )}
                  {isLocked && (
                    <p className="mt-2 text-xs font-semibold text-amber-600">
                      {t("lockedHint")}
                    </p>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
