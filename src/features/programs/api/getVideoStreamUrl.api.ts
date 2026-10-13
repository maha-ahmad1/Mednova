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
  // Same endpoint for the admin review page, per the confirmed docs — no separate admin-only route.
  const response = await axiosInstance.get<ApiResponse<VideoStreamLink>>(
    `/api/programs/${programId}/videos/${videoId}/stream`,
  );

  return response.data.data;
};
