import type { AxiosInstance } from "axios";
import type { ProgramDetailResponse } from "../types/program";

export const getProgramById = async (
  axiosInstance: AxiosInstance,
  id: number,
): Promise<ProgramDetailResponse> => {
  const response = await axiosInstance.get<ProgramDetailResponse>(`/api/programs/${id}`);
  return response.data;
};
