"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface ReviewsNavigationProps {
  currentPage: number;
  totalPages: number;
  totalReviews: number;
  reviewsPerPage: number;
  onPrevPage: () => void;
  onNextPage: () => void;
  onPageChange: (page: number) => void;
}

export function ReviewsNavigation({
  currentPage,
  totalPages,
  totalReviews,
  reviewsPerPage,
  onPrevPage,
  onNextPage,
  onPageChange,
}: ReviewsNavigationProps) {
  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900">
          آراء المشاركين ({totalReviews})
        </h3>

        {totalReviews > reviewsPerPage && (
          <div className="flex items-center gap-2">
            <button
              onClick={onPrevPage}
              disabled={currentPage === 1}
              className={`p-2 rounded-full ${
                currentPage === 1
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
              aria-label="التقييمات السابقة"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            <span className="text-sm text-gray-600 mx-2">
              {currentPage} / {totalPages}
            </span>

            <button
              onClick={onNextPage}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-full ${
                currentPage === totalPages
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
              aria-label="التقييمات التالية"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {totalReviews > reviewsPerPage && (
        <div className="flex justify-center mt-6 md:hidden">
          <div className="flex gap-2">
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                onClick={() => onPageChange(index + 1)}
                className={`w-2 h-2 rounded-full transition-all ${
                  currentPage === index + 1
                    ? "bg-blue-600 w-4"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`الصفحة ${index + 1}`}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
}