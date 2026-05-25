"use client";

import { useFetcher } from "@/hooks/useFetcher";
import type { DisputeDetail } from "../types";

export function useAdminDisputeDetail(id: string | number) {
  return useFetcher<DisputeDetail>(
    ["admin-dispute", String(id)],
    `/api/control-panel/financial/disputes/${id}`,
  );
}
