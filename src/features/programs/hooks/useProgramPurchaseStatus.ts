"use client";

import { useQuery } from "@tanstack/react-query";
import { useAxiosInstance } from "@/lib/axios/axiosInstance";
import { getProgramPurchaseStatus } from "../api";

interface UseProgramPurchaseStatusOptions {
  purchaseId?: number;
  enabled?: boolean;
}

export const useProgramPurchaseStatus = ({
  purchaseId,
  enabled = true,
}: UseProgramPurchaseStatusOptions) => {
  const axiosInstance = useAxiosInstance();

  return useQuery({
    queryKey: ["program-purchase-status", purchaseId],
    enabled: Boolean(purchaseId) && enabled,
    queryFn: () => getProgramPurchaseStatus(axiosInstance, purchaseId as number),
    // Same polling pattern as usePaymentStatus.ts — keep checking every 15s while
    // unpaid, stop once the purchase settles into any other status.
    refetchInterval: (query) => (query.state.data?.status === "unpaid" ? 15000 : false),
  });
};
