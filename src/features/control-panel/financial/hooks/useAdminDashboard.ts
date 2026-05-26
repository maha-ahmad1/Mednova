"use client";

import { useQuery } from "@tanstack/react-query";
import { useAxiosInstance } from "@/lib/axios/axiosInstance";
import { getAdminDashboard } from "../api/adminFinancial.api";

export function useAdminDashboard() {
  const axios = useAxiosInstance();

  return useQuery({
    queryKey: ["admin-financial-dashboard"],
    queryFn: () => getAdminDashboard(axios),
  });
}
