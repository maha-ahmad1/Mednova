
export interface ApiReviewResponse {
  id: number;
  reviewer: Reviewer;
  reviewee: string; 
  reviewee_type: string;
  rating: number;
  comment: string;
}

// Shortened name only — the API no longer returns the reviewer's image or contact details.
export interface Reviewer {
  id?: number;
  full_name?: string;
  name?: string;
  image?: string | null;
}

export interface Review {
  id: number;
  reviewer: Reviewer;
  rating: number;
  comment: string;
  is_mine?: boolean;
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
  isEnrolled?: boolean;
  /** Shown in the review dialog subtitle ("شاركنا تجربتك مع ..."). */
  programTitle?: string;
}

export interface ApiRatingsResponse {
  success: boolean;
  message: string;
  data: ApiReviewResponse[];
  status: string;
}