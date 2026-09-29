"use client";

import { useQuery } from "@tanstack/react-query";
import { useAxiosInstance } from "@/lib/axios/axiosInstance";
import { getConsultantPrograms } from "../api";

export function useConsultantPrograms() {
  const axiosInstance = useAxiosInstance();

  return useQuery({
    queryKey: ["consultant-programs"],
    queryFn: () => getConsultantPrograms(axiosInstance),
  });
}
