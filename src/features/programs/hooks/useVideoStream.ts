"use client";

import { useMutation } from "@tanstack/react-query";
import { useAxiosInstance } from "@/lib/axios/axiosInstance";
import { getAdminProgramVideoStream, getVideoStreamUrl } from "../api";

export type VideoStreamVariant = "patient" | "admin";

// Deliberately a mutation, not a cached query — the link expires after 10 minutes and must
// be requested fresh every time a video is selected/replayed or the previous link expires
// mid-playback. Never wrap this in useQuery with a staleTime; that would let a stale/expired
// link linger in the cache and get reused.
export const useVideoStream = (variant: VideoStreamVariant = "patient") => {
  const axiosInstance = useAxiosInstance();

  return useMutation({
    mutationFn: ({ programId, videoId }: { programId: number; videoId: number }) =>
      variant === "admin"
        ? getAdminProgramVideoStream(axiosInstance, programId, videoId)
        : getVideoStreamUrl(axiosInstance, programId, videoId),
  });
};
