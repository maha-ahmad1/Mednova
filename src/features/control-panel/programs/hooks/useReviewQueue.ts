"use client";

import { useQuery } from "@tanstack/react-query";
import { useAxiosInstance } from "@/lib/axios/axiosInstance";
import { getReviewQueue } from "../api/getReviewQueue.api";

export function useReviewQueue() {
  const axiosInstance = useAxiosInstance();

  return useQuery({
    queryKey: ["review-queue"],
    queryFn: () => getReviewQueue(axiosInstance),
  });
}
