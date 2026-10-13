import type { AxiosInstance } from "axios";
import type { ProgramPurchase } from "../types/review";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  status: string;
}

export const getProgramPurchases = async (
  axiosInstance: AxiosInstance,
  programId: number,
): Promise<ProgramPurchase[]> => {
  const response = await axiosInstance.get<ApiResponse<ProgramPurchase[]>>(
    `/api/control-panel/programs/${programId}/purchases`,
  );

  return response.data.data;
};
