"use client";

import { Star } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface RatingDistributionItem {
  stars: number;
  count: number;
  percentage: number;
}

interface RatingDistributionProps {
  distribution: RatingDistributionItem[];
}

export function RatingDistribution({ distribution }: RatingDistributionProps) {
  return (
    <div className="space-y-3">
      {distribution.map((review) => (
        <div key={review.stars} className="flex items-center gap-4">
          <div className="flex items-center gap-1 w-20">
            <span className="text-sm text-gray-600 w-4">{review.stars}</span>
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-xs text-gray-500">({review.count})</span>
          </div>
          <Progress value={review.percentage} className="flex-1 h-2.5" />
          <span className="text-sm text-gray-600 w-12 font-medium">
            {review.percentage}%
          </span>
        </div>
      ))}
    </div>
  );
}