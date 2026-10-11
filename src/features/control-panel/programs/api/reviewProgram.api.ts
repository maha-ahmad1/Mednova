import type { AxiosInstance } from "axios";
import type { ReviewActionPayload, ReviewProgramDetail } from "../types/review";
import { approveProgram, rejectProgram } from "./programManagement.api";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  status: string;
}

// Confirmed: same endpoints the legacy manual admin flow already uses
// (approveProgram/rejectProgram in programManagement.api.ts) — not a separate
// unified review endpoint. Delegates instead of duplicating the request logic, so
// both the review-queue and ProgramStatusDropdown.tsx always hit the exact same call.
export const reviewProgram = async (
  axiosInstance: AxiosInstance,
  programId: number,
  payload: ReviewActionPayload,
) => {
  return payload.action === "approve"
    ? approveProgram(axiosInstance, programId)
    : rejectProgram(axiosInstance, programId, payload.rejection_reason);
};

export const getReviewProgramDetail = async (
  axiosInstance: AxiosInstance,
  programId: number,
): Promise<ReviewProgramDetail> => {
  // Same GET /api/control-panel/programs/{id} path as the legacy manual-edit flow's
  // getProgramDetails — the review contract expects it to also include submission_number
  // and per-video review_status/rejection_reason.
  const response = await axiosInstance.get<ApiResponse<ReviewProgramDetail>>(
    `/api/control-panel/programs/${programId}`,
  );

  return response.data.data;
};
