// hooks/useRatings.ts
import { useFetcher } from './useFetcher';

export type ReviewableType = 'program' | 'specialist' | 'center';

export interface RatingUser {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  type_account: string;
  birth_date: string;
  gender: string;
  average_rating: number | null;
  total_reviews: number | null;
  is_completed: boolean;
  status: string;
  is_banned: number;
  timezone: string | null;
  email_verified_at: string;
  image: string | null;
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
  reviewee: Reviewee;
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
