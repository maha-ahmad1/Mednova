import type { AxiosInstance } from "axios";
import type { ConsultantProgramResponse } from "../types/consultant-program";

export const submitConsultantProgramForReview = async (
  axiosInstance: AxiosInstance,
  id: number,
): Promise<ConsultantProgramResponse> => {
  const response = await axiosInstance.post<ConsultantProgramResponse>(
    `/api/consultant/programs/${id}/submit`,
  );

  return response.data;
};
