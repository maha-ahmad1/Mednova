import type { AxiosInstance } from "axios";
import type { ConsultantProgramResponse } from "../types/consultant-program";

export const archiveConsultantProgram = async (
  axiosInstance: AxiosInstance,
  id: number,
): Promise<ConsultantProgramResponse> => {
  const response = await axiosInstance.post<ConsultantProgramResponse>(
    `/api/consultant/programs/${id}/archive`,
  );

  return response.data;
};
