"use client";

import { useQuery } from "@tanstack/react-query";
import { useAxiosInstance } from "@/lib/axios/axiosInstance";
import { getProgramVideoDetails } from "../api/createProgram.api";

export function useProgramVideoDetails(videoId: number | null) {
  const axiosInstance = useAxiosInstance();

  return useQuery({
    queryKey: ["control-panel-program-video-details", videoId],
    queryFn: () => getProgramVideoDetails(axiosInstance, Number(videoId)),
    enabled: typeof videoId === "number" && Number.isFinite(videoId),
  });
}
