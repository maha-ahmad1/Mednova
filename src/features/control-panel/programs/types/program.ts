export type ProgramStatus = "draft" | "published" | "archived";

export type ProgramApprovalFilter = "all" | "approved" | "unapproved";
export type ProgramSortBy = "id" | "title" | "price";

export interface ControlPanelProgram {
  id: number;
  title: string;
  creator: string;
  status: ProgramStatus;
  isApproved: boolean;
  price: number | null;
  currency: string | null;
  coverImage: string | null;
}

export interface ProgramsFilters {
  search: string;
  status: "all" | ProgramStatus;
  approval: ProgramApprovalFilter;
  sortBy: ProgramSortBy;
  sortOrder: "asc" | "desc";
  page: number;
  limit: number;
}

export interface ProgramsApiItem {
  id: number;
  title: string;
  creator?: {
    full_name?: string | null;
    name?: string | null;
  } | null;
  creator_name?: string | null;
  status: ProgramStatus;
  is_approved: 0 | 1;
  price: number | string | null;
  currency: string | null;
  cover_image: string | null;
}
