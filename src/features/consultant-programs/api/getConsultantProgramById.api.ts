import type { AxiosInstance } from "axios";
import type { ConsultantProgramResponse } from "../types/consultant-program";

export const getConsultantProgramById = async (
  axiosInstance: AxiosInstance,
  id: number,
): Promise<ConsultantProgramResponse> => {
  const response = await axiosInstance.get<ConsultantProgramResponse>(`/api/consultant/programs/${id}`);
  return response.data;
};
