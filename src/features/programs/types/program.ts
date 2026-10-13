export interface ProgramCreator {
  id: number;
  name: string;
  type: string; // "therapist" | "rehabilitation_center"
  image: string | null;
  // Kept optional for backward compatibility with pre-contract consumers; prefer `name`.
  full_name?: string;
  email?: string;
  phone?: string;
}

export interface Program {
  id: number;
  creator: ProgramCreator;
  title: string;
  description: string;
  what_you_will_learn: string;
  cover_image: string;
  price: string; // e.g. "20.000" — all monetary values on the platform are strings
  currency: string; // "OMR"
  videos_count: number;
  total_duration_minutes: number;
  is_enrolled: boolean;
  // Legacy fields still consumed by some UI (listing/filtering) — optional since the
  // new API contract does not guarantee them.
  status?: string;
  is_approved?: number;
  enrollments_count?: number | null;
  ratings_avg_rating?: number | null;
  ratings_count?: number | null;
  "5_stars"?: number;
  "4_stars"?: number;
  "3_stars"?: number;
  "2_stars"?: number;
  "1_stars"?: number;
}

export interface ProgramsResponse {
  success: boolean;
  message: string;
  data: Program[];
  status: string;
}

export interface ProgramFilters {
  category: string;
  difficulty: string;
  sortBy: string;
}

export interface ProgramVideo {
  id: number;
  title: string;
  description?: string;
  duration_minute: number | null;
  order: number;
  is_program_intro: boolean;
  is_free: boolean;
  is_locked: boolean;
  // Confirmed: no video URL field exists on this resource at all, ever — not just
  // "sent later." The only way to get a playable URL is GET
  // /api/programs/{id}/videos/{videoId}/stream, requested fresh each time a video
  // is selected (see useVideoStream / SignedVideoPlayer).
  status?: string | null;
  // Not confirmed whether GET /api/programs/{id} already filters these server-side
  // or returns everything including pending/rejected — kept optional and filtered
  // defensively in ProgramDetailView until backend confirms.
  review_status?: "pending" | "approved" | "rejected";
}

export interface ProgramDetail extends Program {
  videos: ProgramVideo[];
}

export interface ProgramDetailResponse {
  success: boolean;
  message: string;
  data: ProgramDetail;
  status: string;
}
