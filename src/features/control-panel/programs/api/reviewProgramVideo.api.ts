import type { AxiosInstance } from "axios";
import type { ReviewActionPayload } from "../types/review";

interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
  status: string;
}

export const reviewProgramVideo = async (
  axiosInstance: AxiosInstance,
  programId: number,
  videoId: number,
  payload: ReviewActionPayload,
) => {
  const url = `/api/control-panel/programs/${programId}/videos/${videoId}/${payload.action}`;

  const response =
    payload.action === "approve"
      ? await axiosInstance.patch<ApiResponse>(url)
      : await axiosInstance.patch<ApiResponse>(url, { rejection_reason: payload.rejection_reason });

  return response.data;
};
