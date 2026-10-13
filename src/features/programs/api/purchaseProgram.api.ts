import type { AxiosInstance } from "axios";
import type { ProgramPurchase } from "../types/purchase";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  status: string;
}

// The purchase id is the only thing the payment-link step needs (it goes in the
// URL path), so resolve it defensively and fail here — not later as ".../undefined/...".
const resolvePurchaseId = (raw: unknown): number | undefined => {
  const r = raw as Record<string, unknown> | null | undefined;
  const nested = r?.purchase as Record<string, unknown> | undefined;
  const candidate = r?.id ?? r?.purchase_id ?? nested?.id;
  const id = Number(candidate);
  return Number.isInteger(id) && id > 0 ? id : undefined;
};

export const purchaseProgram = async (
  axiosInstance: AxiosInstance,
  programId: number,
): Promise<ProgramPurchase> => {
  const response = await axiosInstance.post<ApiResponse<ProgramPurchase>>(
    `/api/programs/${programId}/purchase`,
  );

  const purchase = response.data.data;
  const id = resolvePurchaseId(purchase);

  if (id === undefined) {
    throw new Error("purchase id missing in purchase response");
  }

  return { ...purchase, id };
};
