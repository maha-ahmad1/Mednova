import type { AxiosInstance } from "axios";
import type { ProgramPaymentLink, ProgramPaymentLinkPayload } from "../types/purchase";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  status: string;
}

export const createProgramPaymentLink = async (
  axiosInstance: AxiosInstance,
  purchaseId: number,
  payload: ProgramPaymentLinkPayload,
): Promise<ProgramPaymentLink> => {
  if (!Number.isInteger(Number(purchaseId)) || Number(purchaseId) <= 0) {
    throw new Error("purchaseId is missing");
  }

  const response = await axiosInstance.post<ApiResponse<ProgramPaymentLink>>(
    `/api/programs/purchases/${purchaseId}/payment-link`,
    payload,
  );

  return response.data.data;
};
