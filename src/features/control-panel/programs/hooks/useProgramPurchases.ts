"use client";

import { useQuery } from "@tanstack/react-query";
import { useAxiosInstance } from "@/lib/axios/axiosInstance";
import { getProgramPurchases } from "../api/getProgramPurchases.api";

export function useProgramPurchases(programId: number) {
  const axiosInstance = useAxiosInstance();

  return useQuery({
    queryKey: ["program-purchases", programId],
    queryFn: () => getProgramPurchases(axiosInstance, programId),
    enabled: Boolean(programId),
  });
}
