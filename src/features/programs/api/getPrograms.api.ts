import type { AxiosInstance } from "axios";
import type { ProgramsResponse } from "../types/program";

export const getPrograms = async (axiosInstance: AxiosInstance): Promise<ProgramsResponse> => {
  const response = await axiosInstance.get<ProgramsResponse>("/api/programs");
  return response.data;
};
