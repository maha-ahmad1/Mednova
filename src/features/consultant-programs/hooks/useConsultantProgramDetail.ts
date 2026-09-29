"use client";

import { useQuery } from "@tanstack/react-query";
import { useAxiosInstance } from "@/lib/axios/axiosInstance";
import { getConsultantProgramById } from "../api";

export function useConsultantProgramDetail(id: number) {
  const axiosInstance = useAxiosInstance();

  return useQuery({
    queryKey: ["consultant-program", id],
    queryFn: () => getConsultantProgramById(axiosInstance, id),
    enabled: !!id,
  });
}
