export interface CreateProgramVideoPayload {
  title_ar: string;
  description_ar: string;
  duration_minute: number;
  order: number;
  is_program_intro: boolean;
  video_path: File;
}

export interface CreateProgramPayload {
  creator_id: string;
  title_ar: string;
  description_ar: string;
  what_you_will_learn_ar: string;
  price: number;
  currency: string;
  cover_image: File;
  videos: CreateProgramVideoPayload[];
}

export interface CreateProgramResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
  status: string;
}
