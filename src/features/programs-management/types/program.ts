export type ProgramStatus = "draft" | "published" | "archived";

export interface ProgramManagementFilters {
  limit: number;
  status: ProgramStatus | "";
  isApproved: 0 | 1;
}

export interface AdminProgram {
  id: number;
  title: string;
  description: string;
  cover_image: string | null;
  price: number | null;
  currency: string | null;
  status: ProgramStatus;
  is_approved: 0 | 1;
}
