import type { AxiosInstance } from "axios";
import type { VideoStreamLink } from "../types/videoStream";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  status: string;
}

export const getVideoStreamUrl = async (
  axiosInstance: AxiosInstance,
  programId: number,
  videoId: number,
): Promise<VideoStreamLink> => {
  const response = await axiosInstance.get<ApiResponse<VideoStreamLink>>(
    `/api/programs/${programId}/videos/${videoId}/stream`,
  );

  return response.data.data;
};

// Admin-guarded route — the patient route rejects the admin token with 401.
// The response may be `{ url, expires_at }` directly or wrapped in `{ success, data }`;
// accept both until confirmed in the Network tab.
export const getAdminProgramVideoStream = async (
  axiosInstance: AxiosInstance,
  programId: number | string,
  videoId: number | string,
): Promise<VideoStreamLink> => {
  const response = await axiosInstance.get<
    ApiResponse<VideoStreamLink> | VideoStreamLink
  >(`/api/control-panel/programs/${programId}/videos/${videoId}/stream`);

  const body = response.data;
  return "data" in body && body.data ? body.data : (body as VideoStreamLink);
};
