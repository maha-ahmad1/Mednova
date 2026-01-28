
export interface ApiReviewResponse {
  id: number;
  reviewer: Reviewer;
  reviewee: string; 
  reviewee_type: string;
  rating: number;
  comment: string;
}

export interface Reviewer {
  id: number;
  image: string | null;
  full_name: string;
  email: string;
  phone?: string;
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
}

export interface Review {
  id: number;
  reviewer: Reviewer;
  rating: number;
  comment: string;
}

export interface StarRatings {
  "5_stars": number;
  "4_stars": number;
  "3_stars": number;
  "2_stars": number;
  "1_stars": number;
}

export interface CourseReviewsProps {
  programId: number;
  rating: number;
  reviewCount: number;
  starRatings?: StarRatings;
}

export interface ApiRatingsResponse {
  success: boolean;
  message: string;
  data: ApiReviewResponse[];
  status: string;
}