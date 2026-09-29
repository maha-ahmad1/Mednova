"use client";

import { useQuery } from "@tanstack/react-query";
import { useAxiosInstance } from "@/lib/axios/axiosInstance";
import { getConsultantProgramSales } from "../api";

export function useConsultantProgramSales(id: number) {
  const axiosInstance = useAxiosInstance();

  return useQuery({
    queryKey: ["consultant-program-sales", id],
    queryFn: () => getConsultantProgramSales(axiosInstance, id),
    enabled: !!id,
  });
}
