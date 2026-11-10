"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import type { Rating } from "@/hooks/useRatings";
import { useReviewsPagination } from "@/hooks/useReviewsPagination";
import {
  ReviewsList,
  ReviewsNavigation,
  type ReviewItem,
} from "@/shared/ui/components/reviews";

interface ProviderReviewsListProps {
  ratings: Rating[];
  isLoading: boolean;
}

export function ProviderReviewsList({ ratings, isLoading }: ProviderReviewsListProps) {
  const t = useTranslations("specialists.publicProfile.reviews");

  // Whitelist reviewer fields: only name + image, never email / phone / birth_date.
  const reviews: ReviewItem[] = useMemo(
    () =>
      ratings.map((r) => ({
        id: r.id,
        rating: r.rating,
        comment: r.comment,
        reviewer: {
          id: r.reviewer.id,
          full_name: r.reviewer.full_name,
          image: r.reviewer.image,
        },
      })),
    [ratings],
  );

  const { currentPage, totalPages, visibleReviews, goToNextPage, goToPrevPage, goToPage } =
    useReviewsPagination(reviews);

  return (
    <div>
      <ReviewsNavigation
        currentPage={currentPage}
        totalPages={totalPages}
        totalReviews={reviews.length}
        reviewsPerPage={2}
        title={t("listTitle", { count: reviews.length })}
        prevLabel={t("prevPage")}
        nextLabel={t("nextPage")}
        getPageLabel={(page) => t("pageN", { page })}
        onPrevPage={goToPrevPage}
        onNextPage={goToNextPage}
        onPageChange={goToPage}
      />
      <ReviewsList
        reviews={visibleReviews}
        isLoading={isLoading}
        emptyTitle={t("noReviews")}
      />
    </div>
  );
}
