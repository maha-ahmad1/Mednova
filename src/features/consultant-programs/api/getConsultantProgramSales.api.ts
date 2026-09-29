import type { AxiosInstance } from "axios";
import type { ProgramSalesResponse } from "../types/consultant-program";
import { getMockProgramSales } from "./__mock__/consultant-programs.mock";

export const getConsultantProgramSales = async (
  axiosInstance: AxiosInstance,
  id: number,
): Promise<ProgramSalesResponse> => {
  // TODO(consultant-programs-api): swap for GET /api/consultant/programs/:id/sales once the backend ships.
  return {
    success: true,
    message: "",
    data: getMockProgramSales(id),
    status: "success",
  };
};
