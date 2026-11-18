// hooks/useRatings.ts
import { useFetcher } from './useFetcher';

export type ReviewableType = 'program' | 'customer';

// The ratings API returns a shortened reviewer name and no image or contact details.
// `full_name`/`image` are kept optional for older responses.
export interface RatingUser {
  id?: number;
  full_name?: string;
  name?: string;
  image?: string | null;
}

export interface Reviewee {
  id: number;
  title?: string;
  description?: string;
  cover_image?: string;
  price?: number;
  currency?: string;
  status?: string;
  is_approved?: number;
  enrollments_count?: number | null;
  ratings_avg_rating?: number | null;
  ratings_count?: number | null;
  [key: string]: unknown;
}

export interface Rating {
  id: number;
  reviewer: RatingUser;
  reviewee?: Reviewee;
  /** True when the review belongs to the current user (if the API sends it). */
  is_mine?: boolean;
  reviewee_type: string;
  rating: number;
  comment: string;
  created_at?: string;
}

interface UseRatingsOptions {
  enabled?: boolean;
}

export const useRatings = (
  reviewableType: ReviewableType,
  reviewableId: number,
  options?: UseRatingsOptions
) => {
  return useFetcher<
    Rating[],
    {
      reviewable_type: ReviewableType;
      reviewable_id: number;
    }
  >(
    ['ratings', reviewableType, reviewableId],
    '/api/ratings',
    {
      params: {
        reviewable_type: reviewableType,
        reviewable_id: reviewableId,
      },
      enabled: !!reviewableId && (options?.enabled ?? true),
    }
  );
};
