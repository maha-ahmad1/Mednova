"use client";

import { useMemo, useState } from "react";
import { Lock, PlayCircle, Clock } from "lucide-react";
import type { ProgramVideo } from "@/features/programs/types/program";
import { LockedContentOverlay } from "@/shared/ui/components/LockedContentOverlay";
import { getVideoAccessState } from "@/features/programs/utils/access";
import { SignedVideoPlayer } from "@/features/programs/ui/shared/SignedVideoPlayer";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useTranslations } from "next-intl";
interface ProgramVideosProps {
  programId: number;
  videos: ProgramVideo[];
  coverImage?: string | null;
  /** Deep-link target from "دوراتي"'s "متابعة المشاهدة" — falls back to the first video. */
  initialVideoId?: number;
}

export function ProgramVideos({ programId, videos, coverImage, initialVideoId }: ProgramVideosProps) {
  const t = useTranslations("programs.detail");
  const [selectedVideoId, setSelectedVideoId] = useState<number | null>(() => {
    if (initialVideoId && videos.some((video) => video.id === initialVideoId)) {
      return initialVideoId;
    }
    return videos[0]?.id ?? null;
  });
  const selectedVideo = useMemo(
    () => videos.find((video) => video.id === selectedVideoId) ?? null,
    [selectedVideoId, videos],
  );
  // Using the shared access helper keeps the locked-state logic consistent across UI elements.
  const selectedAccess = getVideoAccessState(selectedVideo?.is_locked);

  if (!videos || videos.length === 0) {
    return null;
  }

  return (
    <div
      id="program-videos"
      className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8"
    >
      <h2 className="text-2xl font-bold text-gray-900 mb-6">{t("content")}</h2>

      {selectedVideo && (
        <div className="mb-6">
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
                {/* <PlayCircle className="h-12 w-12 text-white/70" /> */}
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

          return (
            <button
              key={video.id}
              onClick={() => setSelectedVideoId(video.id)}
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
                    "w-12 h-12 rounded-lg flex items-center justify-center",
                    isSelected ? "bg-[#32A88D]" : "bg-gray-100",
                    isLocked && "bg-amber-100",
                  )}
                >
                  {isLocked ? (
                    <Lock className="w-5 h-5 text-amber-600" />
                  ) : (
                    <PlayCircle
                      className={cn(
                        "w-6 h-6",
                        isSelected ? "text-white" : "text-gray-600",
                      )}
                    />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
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
                    {video.duration_minute && (
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Clock className="w-4 h-4" />
                        <span>{t("minutes", { count: video.duration_minute })}</span>
                      </div>
                    )}
                  </div>
                  <p dir="auto" className="text-sm text-gray-600 line-clamp-2">
                    {video.description}
                  </p>
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
