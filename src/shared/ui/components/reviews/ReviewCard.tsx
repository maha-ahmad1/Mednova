"use client";

import { Star } from "lucide-react";
import { getReviewerInitial } from "./review-utils";

// Minimal shape on purpose: the API returns only a shortened reviewer name (no image),
// so the card shows a letter avatar. Contact details never reach the UI.
export interface ReviewItem {
  id: number;
  rating: number;
  comment?: string | null;
  reviewer: {
    id?: number;
    name: string;
  };
}

interface ReviewCardProps {
  review: ReviewItem;
}

export function ReviewCard({ review }: ReviewCardProps) {
  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-3 h-3 ${
              star <= Math.floor(rating)
                ? "fill-yellow-400 text-yellow-400"
                : star === Math.ceil(rating) && rating % 1 !== 0
                  ? "fill-yellow-400 text-yellow-400 opacity-50"
                  : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="border border-gray-200 rounded-xl p-4 hover:border-gray-300 transition-colors">
      <div className="flex items-center gap-3 mb-3">
        <div
          aria-hidden="true"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#32A88D]/10 text-base font-semibold text-[#32A88D]"
        >
          {getReviewerInitial(review.reviewer.name)}
        </div>
        <div>
          <div className="font-medium text-gray-900">{review.reviewer.name}</div>
          <div className="flex items-center gap-1 mt-1">
            {renderStars(review.rating)}
            <span className="text-xs text-gray-500 ms-1">{review.rating.toFixed(1)}</span>
          </div>
        </div>
      </div>
      {review.comment && (
        <p className="text-gray-700 text-sm line-clamp-4 break-words">{review.comment}</p>
      )}
    </div>
  );
}
