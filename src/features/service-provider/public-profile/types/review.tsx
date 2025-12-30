export interface Review {
  id: number;
  reviewer: Reviewer;
  reviewee: Reviewee;
  reviewee_type: 'customer' | 'program' | 'platform';
  rating: number;
  comment?: string;
  created_at?: string;
}

export interface Reviewer {
  id: number;
  image: string;
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
  timezone: string;
  email_verified_at: string;
}

export interface Reviewee {
  id: number;
  title?: string;
  description?: string;
  cover_image?: string;
  price?: number;
  status?: string;
  is_approved?: number;
  enrollments_count?: number | null;
  ratings_avg_rating?: number | null;
  ratings_count?: number | null;
  full_name?: string;
  email?: string;
  // يمكن إضافة حقول أخرى حسب الحاجة
}

export interface SubmitReviewPayload {
  reviewer_id: number;
  reviewee_id: number;
  reviewee_type: 'customer' | 'program' | 'platform';
  rating: number;
  comment?: string;
}

export interface SubmitReviewResponse {
  success: boolean;
  message: string;
  data: Review;
  status: string;
}