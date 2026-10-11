import type { AxiosInstance } from "axios";
import type { ProgramSalesResponse } from "../types/consultant-program";

export const getConsultantProgramSales = async (
  axiosInstance: AxiosInstance,
  id: number,
): Promise<ProgramSalesResponse> => {
  const response = await axiosInstance.get<ProgramSalesResponse>(
    `/api/consultant/programs/${id}/sales`,
  );

  return response.data;
};
