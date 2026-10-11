import type { AxiosInstance } from "axios";
import type { ConsultantProgramsResponse } from "../types/consultant-program";

export const getConsultantPrograms = async (
  axiosInstance: AxiosInstance,
): Promise<ConsultantProgramsResponse> => {
  const response = await axiosInstance.get<ConsultantProgramsResponse>("/api/consultant/programs");
  return response.data;
};
