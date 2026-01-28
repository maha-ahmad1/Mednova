"use client";

import { Star } from "lucide-react";
import { Review } from "@/features/programs/types/reviews";

interface ReviewCardProps {
  review: Review;
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
        <div className="relative">
          <img
            src={review.reviewer.image || "./images/placeholder.svg"}
            alt={review.reviewer.full_name}
            className="w-10 h-10 rounded-full object-cover border border-gray-200"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "./images/placeholder.svg";
            }}
          />
        </div>
        <div>
          <div className="font-medium text-gray-900">
            {review.reviewer.full_name}
          </div>
          <div className="flex items-center gap-1 mt-1">
            {renderStars(review.rating)}
            <span className="text-xs text-gray-500 mr-1">
              {review.rating.toFixed(1)}
            </span>
          </div>
        </div>
      </div>
      <p className="text-gray-700 text-sm line-clamp-4">{review.comment}</p>
    </div>
  );
}