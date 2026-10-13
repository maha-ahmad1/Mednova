// Types for the admin review-queue flow (submitted courses + new videos on published
// courses). Kept separate from ./program.ts, which backs the legacy manual admin
// create/edit flow — the two contracts have a different shape and are not interchangeable.

export interface ReviewQueueProgram {
  id: number;
  title: string;
  creator_name: string;
  price: string;
  videos_count: number;
  submitted_at: string;
  /** > 1 means this was resubmitted after an earlier rejection. */
  submission_number: number;
}

export interface ReviewQueueVideo {
  id: number;
  program_id: number;
  program_title: string;
  title: string;
  created_at: string;
}

export interface ReviewQueue {
  programs: ReviewQueueProgram[];
  videos: ReviewQueueVideo[];
}

export type ReviewActionPayload =
  | { action: "approve" }
  | { action: "reject"; rejection_reason: string };

export type ReviewStatus = "pending" | "approved" | "rejected";

export interface ReviewProgramVideoDetail {
  id: number;
  title: string;
  duration_minute: number | null;
  video_path: string | null;
  is_program_intro: boolean;
  review_status: ReviewStatus;
  rejection_reason: string | null;
}

// Same GET /api/control-panel/programs/{id} path as the legacy manual admin edit flow
// (programManagement.api.ts -> getProgramDetails / ControlPanelProgramDetails), but this is
// its own type since the review contract's response shape (submission_number, per-video
// review_status/rejection_reason) is different from ControlPanelProgramDetails.
export interface ReviewProgramDetail {
  creator: { full_name: string };
  id: number;
  title: string;
  creator_name: string;
  price: string;
  currency: string;
  submission_number: number;
  submitted_at: string;
  videos: ReviewProgramVideoDetail[];
}

export type ProgramPurchaseStatus = "completed" | "pending" | "refunded" | "failed";

export interface ProgramPurchase {
  id: number;
  patient_name: string;
  amount: string;
  currency: string;
  status: ProgramPurchaseStatus;
  status_label: string;
  purchased_at: string;
}
