import type { AxiosInstance } from "axios";
import type { ConsultantProgramsResponse } from "../types/consultant-program";
import { getMockConsultantPrograms } from "./__mock__/consultant-programs.mock";

export const getConsultantPrograms = async (
  axiosInstance: AxiosInstance,
): Promise<ConsultantProgramsResponse> => {
  // TODO(consultant-programs-api): swap for GET /api/consultant/programs once the backend ships.
  return {
    success: true,
    message: "",
    data: getMockConsultantPrograms(),
    status: "success",
  };
};
