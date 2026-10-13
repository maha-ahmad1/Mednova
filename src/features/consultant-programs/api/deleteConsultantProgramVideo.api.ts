import type { AxiosInstance } from "axios";
import type { ConsultantProgramResponse } from "../types/consultant-program";

export const deleteConsultantProgramVideo = async (
  axiosInstance: AxiosInstance,
  programId: number,
  videoId: number,
): Promise<ConsultantProgramResponse> => {
  const response = await axiosInstance.delete<ConsultantProgramResponse>(
    `/api/consultant/programs/${programId}/videos/${videoId}`,
  );

  return response.data;
};
