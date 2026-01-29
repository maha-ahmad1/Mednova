export interface ProgramCreator {
  id: number;
  image: string | null;
  full_name: string;
  email: string;
  phone: string;
}

export interface Program {
  id: number;
  creator: ProgramCreator;
  title: string;
  description: string;
  cover_image: string;
  price: number;
  status: string;
  is_approved: number;
  enrollments_count: number | null;
  ratings_avg_rating: number | null;
  ratings_count: number | null;
  "5_stars": number;
  "4_stars": number;
  "3_stars": number;
  "2_stars": number;
  "1_stars": number;
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
  description: string;
  video_path: string;
  is_free: number | null;
  duration_minute: number | null;
  order: number;
  status: string | null;
  is_program_intro?: number | null;
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
