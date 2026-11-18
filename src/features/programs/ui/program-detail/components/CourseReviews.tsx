"use client";

import { useRatings } from "@/hooks/useRatings";
import { useRatingDistribution } from "@/features/programs/hooks/useRatingDistribution";
import { useReviewsPagination } from "@/hooks/useReviewsPagination";
import { useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import {
  OverallRating,
  RatingDistribution,
  CourseReviewForm,
} from "./course-reviews";
import { ReviewsNavigation, ReviewsList } from "@/shared/ui/components/reviews";
import { CourseReviewsProps } from "@/features/programs/types/reviews";

export function CourseReviews({
  programId,
  rating,
  reviewCount,
  starRatings,
  isEnrolled,
}: CourseReviewsProps) {
  const t = useTranslations("programs.detail");
  const { data: ratingsResponse, isLoading } = useRatings("program", programId);
  
  const reviews = (ratingsResponse || []).map((item) => ({
    id: item.id,
    rating: item.rating,
    comment: item.comment,
    reviewer: item.reviewer,
  }));

  const reviewsDistribution = useRatingDistribution(starRatings, reviewCount);
  
  const {
    currentPage,
    totalPages,
    visibleReviews,
    goToNextPage,
    goToPrevPage,
    goToPage,
    setCurrentPage,
  } = useReviewsPagination(reviews);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft = 0;
    }
  }, [currentPage]);

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        {t("reviewsTitle")}
      </h2>

      {/* Overall Rating and Distribution */}
      <div className="grid md:grid-cols-3 gap-8 mb-8">
        <OverallRating rating={rating} reviewCount={reviewCount} />
        
        <div className="md:col-span-2">
          <RatingDistribution distribution={reviewsDistribution} />
        </div>
      </div>

      {/* Add your review */}
      <div className="mb-8">
        <CourseReviewForm
          programId={programId}
          isEnrolled={isEnrolled === true}
          reviews={reviews}
        />
      </div>

      {/* Reviews Section */}
      <div className="mt-8 pt-8 border-t border-gray-200">
        <ReviewsNavigation
          currentPage={currentPage}
          totalPages={totalPages}
          totalReviews={reviews.length}
          reviewsPerPage={2}
          title={t("participantsOpinions", { count: reviews.length })}
          prevLabel={t("prevReviews")}
          nextLabel={t("nextReviews")}
          getPageLabel={(page) => t("pageN", { page })}
          onPrevPage={goToPrevPage}
          onNextPage={goToNextPage}
          onPageChange={goToPage}
        />

        {/* Reviews Container */}
        <div ref={scrollContainerRef} className="overflow-hidden">
          <ReviewsList
            reviews={visibleReviews}
            isLoading={isLoading}
            emptyTitle={t("noReviews")}
            emptyHint={t("beFirst")}
          />
        </div>
      </div>
    </div>
  );
}