import type { AxiosInstance } from "axios";
import type { ConsultantProgramResponse } from "../types/consultant-program";
import { getMockConsultantProgramById } from "./__mock__/consultant-programs.mock";

export const getConsultantProgramById = async (
  axiosInstance: AxiosInstance,
  id: number,
): Promise<ConsultantProgramResponse> => {
  // TODO(consultant-programs-api): swap for GET /api/consultant/programs/:id once the backend ships.
  const program = getMockConsultantProgramById(id);

  if (!program) {
    throw new Error("Program not found");
  }

  return {
    success: true,
    message: "",
    data: program,
    status: "success",
  };
};
