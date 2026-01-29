import { useState, useMemo } from "react";
import { Review } from "@/features/programs/types/reviews";

export function useReviewsPagination(
  reviews: Review[],
  reviewsPerPage: number = 2
) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(reviews.length / reviewsPerPage);

  const visibleReviews = useMemo(() => {
    const startIndex = (currentPage - 1) * reviewsPerPage;
    const endIndex = startIndex + reviewsPerPage;
    return reviews.slice(startIndex, endIndex);
  }, [currentPage, reviews, reviewsPerPage]);

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return {
    currentPage,
    totalPages,
    visibleReviews,
    goToNextPage,
    goToPrevPage,
    goToPage,
    setCurrentPage,
  };
}