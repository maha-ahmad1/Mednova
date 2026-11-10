"use client";

import { Star } from "lucide-react";
import { ReviewCard, type ReviewItem } from "./ReviewCard";

interface ReviewsListProps {
  reviews: ReviewItem[];
  isLoading: boolean;
  emptyTitle: string;
  emptyHint?: string;
}

export function ReviewsList({
  reviews,
  isLoading,
  emptyTitle,
  emptyHint,
}: ReviewsListProps) {
  if (isLoading) {
    return (
      <div className="grid md:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <div key={i} className="border border-gray-200 rounded-xl p-4 animate-pulse">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-10 h-10 bg-gray-200 rounded-full" />
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="h-3 bg-gray-200 rounded w-20"></div>
              </div>
            </div>
            <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="md:col-span-2 text-center py-8">
        <div className="text-gray-400 mb-2">
          <Star className="w-12 h-12 mx-auto" />
        </div>
        <p className="text-gray-500">{emptyTitle}</p>
        {emptyHint && <p className="text-sm text-gray-400 mt-1">{emptyHint}</p>}
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {reviews.map((review) => (
        <ReviewCard key={review.id} review={review} />
      ))}
    </div>
  );
}
