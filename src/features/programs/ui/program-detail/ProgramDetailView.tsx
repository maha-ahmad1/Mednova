"use client";

import type { ProgramDetail } from "@/features/programs/types/program";
import { useProgramDetailQuery } from "@/features/programs/hooks";
import { ProgramDetailHeader } from "./components/ProgramDetailHeader";
import { ProgramDetailContent } from "./components/ProgramDetailContent";
import { ProgramVideos } from "./components/ProgramVideos";
import { ProgramEnrollment } from "./components/ProgramEnrollment";
import { CourseReviews } from "./components/CourseReviews";
import { RelatedCourses } from "./components/RelatedCourses";
import { ErrorState } from "@/shared/ui/components/states/ErrorState";
import { ProgramDetailSkeleton } from "./components/ProgramDetailSkeleton";

interface ProgramDetailViewProps {
  programId: number;
}

export function ProgramDetailView({
  programId,
}: ProgramDetailViewProps): React.ReactNode {
  const { data, isLoading, error } = useProgramDetailQuery(programId);

  if (isLoading) {
    return <ProgramDetailSkeleton />;
  }

  if (error || !data?.success || !data?.data) {
    return <ErrorState />;
  }

  const program: ProgramDetail = data.data;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <ProgramDetailHeader program={program} />

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <ProgramDetailContent program={program} />
            <ProgramVideos videos={program.videos} />

            {/* Reviews Section */}
            <CourseReviews
              programId={program.id}
              rating={program.ratings_avg_rating ?? 0}
              reviewCount={program.ratings_count ?? 0}
              starRatings={{
                "5_stars": program["5_stars"],
                "4_stars": program["4_stars"],
                "3_stars": program["3_stars"],
                "2_stars": program["2_stars"],
                "1_stars": program["1_stars"],
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
