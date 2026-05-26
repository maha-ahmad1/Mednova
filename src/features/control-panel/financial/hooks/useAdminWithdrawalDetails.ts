"use client";

import { useQuery } from "@tanstack/react-query";
import { useAxiosInstance } from "@/lib/axios/axiosInstance";
import { getAdminWithdrawalDetails } from "../api/adminFinancial.api";

/**
 * Fetches full withdrawal detail.
 * Pass `id = null` when no dialog is open — the query will be disabled.
 */
export function useAdminWithdrawalDetails(id: string | null) {
  const axios = useAxiosInstance();

  return useQuery({
    queryKey: ["admin-financial-withdrawal-detail", id],
    queryFn: () => getAdminWithdrawalDetails(axios, id!),
    enabled: id !== null,
  });
}
