"use client";

import { useSearchParams } from "next/navigation";
import type { ProgramDetail } from "@/features/programs/types/program";
import { useProgramDetailQuery } from "@/features/programs/hooks";
import { ProgramDetailHeader } from "./components/ProgramDetailHeader";
import { ProgramDetailContent } from "./components/ProgramDetailContent";
import { ProgramVideos } from "./components/ProgramVideos";
import { ProgramEnrollment } from "./components/ProgramEnrollment";
import { CourseReviews } from "./components/CourseReviews";
import { RelatedCourses } from "./components/RelatedCourses";
import { classifyApiError } from "@/lib/classifyApiError";
import { ErrorState } from "@/shared/ui/components/states/ErrorState";
import { ProgramDetailSkeleton } from "./components/ProgramDetailSkeleton";

interface ProgramDetailViewProps {
  programId: number;
}

export function ProgramDetailView({
  programId,
}: ProgramDetailViewProps): React.ReactNode {
  const { data, isPending: isLoading, error, refetch } = useProgramDetailQuery(programId);
  const searchParams = useSearchParams();
  // "متابعة المشاهدة" from "دوراتي" links here with ?video={last_video_id} — jump straight
  // to that video instead of always defaulting to the first one.
  const videoParam = searchParams.get("video");
  const initialVideoId = videoParam ? Number(videoParam) : undefined;

  if (isLoading) {
    return <ProgramDetailSkeleton />;
  }

  if (error) {
    const { title, message } = classifyApiError(error);
    return (
      <ErrorState
        title={title}
        description={message}
        onRetry={() => refetch()}
      />
    );
  }

  if (!data?.success || !data?.data) {
    return <ErrorState onRetry={() => refetch()} />;
  }

  const program: ProgramDetail = data.data;

  // Defensive until backend confirms GET /api/programs/{id} already excludes
  // non-approved videos — if it ever returns everything, this keeps a patient
  // from seeing content that's still pending review or was rejected.
  const approvedVideos = program.videos.filter(
    (video) => video.review_status !== "pending" && video.review_status !== "rejected",
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <ProgramDetailHeader program={program} />

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <ProgramDetailContent program={program} />
            <ProgramVideos
              programId={program.id}
              coverImage={program.cover_image}
              videos={approvedVideos}
              initialVideoId={initialVideoId}
            />

            {/* Reviews Section */}
            <CourseReviews
              programId={program.id}
              rating={program.ratings_avg_rating ?? 0}
              reviewCount={program.ratings_count ?? 0}
              starRatings={{
                "5_stars": program["5_stars"] ?? 0,
                "4_stars": program["4_stars"] ?? 0,
                "3_stars": program["3_stars"] ?? 0,
                "2_stars": program["2_stars"] ?? 0,
                "1_stars": program["1_stars"] ?? 0,
              }}
            />
          </div>

          <div className="lg:col-span-1">
            <ProgramEnrollment program={program} />
          </div>
        </div>

        {/* Related Courses Section */}
        <div className="mt-12">
          <RelatedCourses programId={programId} />
        </div>
      </div>
    </div>
  );
}
