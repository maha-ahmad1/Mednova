"use client";

import { useQuery } from "@tanstack/react-query";
import { useAxiosInstance } from "@/lib/axios/axiosInstance";
import type { AdminTransactionType } from "../types";
import { getAdminTransactions } from "../api/adminFinancial.api";

const PER_PAGE = 15;

export function useAdminTransactions(
  type: AdminTransactionType | "all" = "all",
  page = 1,
) {
  const axios = useAxiosInstance();

  const query = useQuery({
    queryKey: ["admin-financial-transactions", type, page],
    queryFn: () => getAdminTransactions(axios, { type, page, per_page: PER_PAGE }),
  });

  return {
    ...query,
    items: query.data?.data ?? [],
    pagination: query.data?.pagination,
  };
}
