"use client";

import { useQuery } from "@tanstack/react-query";
import { useAxiosInstance } from "@/lib/axios/axiosInstance";
import type { EscrowStatusFilter } from "../types";
import { getAdminEscrow } from "../api/adminFinancial.api";

const PER_PAGE = 15;

export function useAdminEscrow(status: EscrowStatusFilter = "all", page = 1) {
  const axios = useAxiosInstance();

  const query = useQuery({
    queryKey: ["admin-financial-escrow", status, page],
    queryFn: () => getAdminEscrow(axios, { status, page, per_page: PER_PAGE }),
  });

  return {
    ...query,
    items: query.data?.data.data ?? [],
    summary: query.data?.data.summary,
    pagination: query.data?.pagination,
  };
}
