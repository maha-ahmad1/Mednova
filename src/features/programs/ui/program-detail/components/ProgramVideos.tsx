"use client";

import { useMemo, useState } from "react";
import { Lock, PlayCircle, Clock } from "lucide-react";
import type { ProgramVideo } from "@/features/programs/types/program";
import { LockedContentOverlay } from "@/shared/ui/components/LockedContentOverlay";
import { getVideoAccessState } from "@/features/programs/utils/access";
import { cn } from "@/lib/utils";
import Image from "next/image";
interface ProgramVideosProps {
  videos: ProgramVideo[];
  coverImage?: string | null;
}

export function ProgramVideos({ videos, coverImage }: ProgramVideosProps) {
  const [selectedVideoId, setSelectedVideoId] = useState<number | null>(
    videos[0]?.id ?? null,
  );
  const selectedVideo = useMemo(
    () => videos.find((video) => video.id === selectedVideoId) ?? null,
    [selectedVideoId, videos],
  );
  // Using the shared access helper keeps the locked-state logic consistent across UI elements.
  // const selectedAccess = getVideoAccessState(selectedVideo?.is_free);
  const selectedAccess = getVideoAccessState(
    selectedVideo?.is_free,
    selectedVideo?.is_program_intro,
  );

  if (!videos || videos.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">محتوى البرنامج</h2>

      {selectedVideo && (
        <div className="mb-6">
          <LockedContentOverlay
            isLocked={selectedAccess.isLocked}
            className="relative aspect-video rounded-xl mb-4"
            title="هذا الفيديو مقفل"
            description="اشترك للوصول إلى جميع الدروس"
            ctaLabel="اشترك للوصول"
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
              <video
                key={selectedVideo.id}
                controls
                className="h-full w-full"
                poster={selectedVideo.video_path}
              >
                <source src={selectedVideo.video_path} type="video/mp4" />
                متصفحك لا يدعم تشغيل الفيديو
              </video>
            )}
          </LockedContentOverlay>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {selectedVideo.title}
          </h3>
          <p className="text-gray-600 leading-relaxed">
            {selectedVideo.description}
          </p>
        </div>
      )}

      <div className="space-y-3">
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          قائمة الفيديوهات ({videos.length})
        </h3>
        {videos.map((video, index) => {
          const { isLocked } = getVideoAccessState(
            video.is_free,
            video.is_program_intro,
          );
          const isSelected = selectedVideo?.id === video.id;

          return (
            <button
              key={video.id}
              onClick={() => setSelectedVideoId(video.id)}
              className={cn(
                "w-full text-right p-4 rounded-xl border transition-all duration-300",
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
                    <h4 className="font-bold text-gray-900">
                      {index + 1}. {video.title}
                      
                      {video.is_program_intro === 1 && (
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                          فيديو تعريفي
                        </span>
                      )}
                    </h4>
                    {video.duration_minute && (
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Clock className="w-4 h-4" />
                        <span>{video.duration_minute} دقيقة</span>
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {video.description}
                  </p>
                  {isLocked && (
                    <p className="mt-2 text-xs font-semibold text-amber-600">
                      المحتوى مقفل • اشترك للوصول
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
