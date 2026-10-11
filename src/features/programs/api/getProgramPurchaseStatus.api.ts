import type { AxiosInstance } from "axios";
import type { ProgramPurchase } from "../types/purchase";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  status: string;
}

export const getProgramPurchaseStatus = async (
  axiosInstance: AxiosInstance,
  purchaseId: number,
): Promise<ProgramPurchase> => {
  const response = await axiosInstance.get<ApiResponse<ProgramPurchase>>(
    `/api/programs/purchases/${purchaseId}/status`,
  );

  return response.data.data;
};
