"use client";

import { useQuery } from "@tanstack/react-query";
import { useAxiosInstance } from "@/lib/axios/axiosInstance";
import { getProgramDetails } from "../api/programManagement.api";

export function useProgramDetails(programId: string) {
  const axiosInstance = useAxiosInstance();

  return useQuery({
    queryKey: ["control-panel-program-details", programId],
    queryFn: () => getProgramDetails(axiosInstance, programId),
    enabled: Boolean(programId),
  });
}
