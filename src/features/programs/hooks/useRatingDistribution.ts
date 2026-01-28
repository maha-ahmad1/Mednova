import { StarRatings } from "@/features/programs/types/reviews";

interface RatingDistributionItem {
  stars: number;
  count: number;
  percentage: number;
}

export function useRatingDistribution(
  starRatings?: StarRatings,
  reviewCount: number = 0
): RatingDistributionItem[] {
  if (!starRatings || reviewCount === 0) {
    return [
      { stars: 5, count: 0, percentage: 0 },
      { stars: 4, count: 0, percentage: 0 },
      { stars: 3, count: 0, percentage: 0 },
      { stars: 2, count: 0, percentage: 0 },
      { stars: 1, count: 0, percentage: 0 },
    ];
  }

  const ratings = [
    { stars: 5, count: starRatings["5_stars"] },
    { stars: 4, count: starRatings["4_stars"] },
    { stars: 3, count: starRatings["3_stars"] },
    { stars: 2, count: starRatings["2_stars"] },
    { stars: 1, count: starRatings["1_stars"] },
  ];

  return ratings.map((item) => ({
    stars: item.stars,
    count: item.count,
    percentage:
      reviewCount > 0 ? Math.round((item.count / reviewCount) * 100) : 0,
  }));
}