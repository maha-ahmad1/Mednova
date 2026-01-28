"use client";

import { Star } from "lucide-react";

interface OverallRatingProps {
  rating: number;
  reviewCount: number;
}

export function OverallRating({ rating, reviewCount }: OverallRatingProps) {
  return (
    <div className="text-center">
      <div className="text-5xl font-bold text-gray-900 mb-2">
        {parseFloat(rating.toString()).toFixed(1)}
      </div>
      <div className="flex justify-center gap-1 mb-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-6 h-6 ${
              star <= Math.floor(rating)
                ? "fill-yellow-400 text-yellow-400"
                : star === Math.ceil(rating) && rating % 1 !== 0
                  ? "fill-yellow-400 text-yellow-400 opacity-70"
                  : "text-gray-300"
            }`}
          />
        ))}
      </div>
      <div className="text-gray-600">متوسط التقييم</div>
    </div>
  );
}