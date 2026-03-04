export interface ProgramVideoPayload {
  title_ar: string;
  description_ar: string;
  duration_minute: number;
  order: number;
  is_program_intro: boolean;
  is_free: boolean;
  video_path?: File;
}

export interface CreateProgramPayload {
  creator_id: string;
  title_ar: string;
  description_ar: string;
  what_you_will_learn_ar: string;
  price: number;
  currency: string;
  cover_image: File;
  videos: Array<ProgramVideoPayload & { video_path: File }>;
}

export interface UpdateProgramPayload {
  title_ar: string;
  description_ar: string;
  what_you_will_learn_ar: string;
  price: number;
  currency: string;
  cover_image?: File;
}

export interface AddProgramVideosPayload {
  program_id: number;
  videos: ProgramVideoPayload[];
}

export type UpdateProgramVideoPayload = ProgramVideoPayload;

export interface CreateProgramResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
  status: string;
}
