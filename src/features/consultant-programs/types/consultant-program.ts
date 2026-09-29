export type ProgramStatus =
  | "draft"
  | "pending"
  | "approved"
  | "rejected"
  | "archived";
export type VideoReviewStatus = "pending" | "approved" | "rejected";

export interface ConsultantProgramCan {
  edit: boolean;
  delete: boolean;
  submit: boolean;
  archive: boolean;
  add_video: boolean;
}

export interface ConsultantProgramVideo {
  id: number;
  title_ar: string;
  title_en: string;
  order: number;
  is_program_intro: boolean;
  is_free: boolean;
  review_status: VideoReviewStatus;
  rejection_reason: string | null;
}

export interface ConsultantProgram {
  id: number;
  title_ar: string;
  title_en: string;
  description_ar?: string;
  description_en?: string;
  what_you_will_learn_ar?: string;
  what_you_will_learn_en?: string;
  cover_image?: string | null;
  price: string; // "20.000"
  status: ProgramStatus;
  status_label: string;
  rejection_reason: string | null; // سبب رفض الكورس ككل (وليس فيديو منفرد)
  platform_commission_rate: string; // "10.00"
  your_earning_per_sale: string; // "18.000"
  sales_count: number;
  can: ConsultantProgramCan;
  videos: ConsultantProgramVideo[];
}

export interface ProgramSalesStats {
  sales_count: number;
  total_earnings: string;
  by_month: { month: string; sales_count: number; earnings: string }[];
}

export interface ConsultantProgramsResponse {
  success: boolean;
  message: string;
  data: ConsultantProgram[];
  status: string;
}

export interface ConsultantProgramResponse {
  success: boolean;
  message: string;
  data: ConsultantProgram;
  status: string;
}

export interface ProgramSalesResponse {
  success: boolean;
  message: string;
  data: ProgramSalesStats;
  status: string;
}

export interface ConsultantProgramFormPayload {
  title_ar: string;
  title_en: string;
  description_ar: string;
  description_en: string;
  what_you_will_learn_ar: string;
  what_you_will_learn_en: string;
  price: number;
  cover_image?: File;
}

export interface ConsultantProgramVideoPayload {
  title_ar: string;
  title_en: string;
  order: number;
  is_program_intro: boolean;
  is_free: boolean;
  video: File;
}
