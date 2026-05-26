"use client";

import { useQuery } from "@tanstack/react-query";
import { useAxiosInstance } from "@/lib/axios/axiosInstance";
import type { AdminWithdrawalStatusFilter } from "../types";
import { getAdminWithdrawals } from "../api/adminFinancial.api";

const PER_PAGE = 15;

export function useAdminWithdrawals(
  status: AdminWithdrawalStatusFilter = "pending_review",
  page = 1,
) {
  const axios = useAxiosInstance();

  const query = useQuery({
    queryKey: ["admin-financial-withdrawals", status, page],
    queryFn: () => getAdminWithdrawals(axios, { status, page, per_page: PER_PAGE }),
  });

  return {
    ...query,
    items: query.data?.data?.data ?? [],
    pagination: query.data?.pagination,
  };
}
