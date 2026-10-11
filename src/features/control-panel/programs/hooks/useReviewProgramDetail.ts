"use client";

import { useQuery } from "@tanstack/react-query";
import { useAxiosInstance } from "@/lib/axios/axiosInstance";
import { getReviewProgramDetail } from "../api/reviewProgram.api";

export function useReviewProgramDetail(programId: number) {
  const axiosInstance = useAxiosInstance();

  return useQuery({
    queryKey: ["review-program-detail", programId],
    queryFn: () => getReviewProgramDetail(axiosInstance, programId),
    enabled: Boolean(programId),
  });
}
