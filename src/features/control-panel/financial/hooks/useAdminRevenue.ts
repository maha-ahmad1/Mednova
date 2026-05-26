"use client";

import { useQuery } from "@tanstack/react-query";
import { useAxiosInstance } from "@/lib/axios/axiosInstance";
import { getAdminRevenue } from "../api/adminFinancial.api";

const PER_PAGE = 15;

export function useAdminRevenue(month?: string, page = 1) {
  const axios = useAxiosInstance();

  const query = useQuery({
    queryKey: ["admin-financial-revenue", month, page],
    queryFn: () => getAdminRevenue(axios, { month, page, per_page: PER_PAGE }),
  });

  return {
    ...query,
    items: query.data?.data.data ?? [],
    summary: query.data?.data.summary,
    pagination: query.data?.pagination,
  };
}
