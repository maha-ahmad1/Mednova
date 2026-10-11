"use client";

import { useMutation } from "@tanstack/react-query";
import { useAxiosInstance } from "@/lib/axios/axiosInstance";
import { getVideoStreamUrl } from "../api";

// Deliberately a mutation, not a cached query — the link expires after 10 minutes and must
// be requested fresh every time a video is selected/replayed or the previous link expires
// mid-playback. Never wrap this in useQuery with a staleTime; that would let a stale/expired
// link linger in the cache and get reused.
export const useVideoStream = () => {
  const axiosInstance = useAxiosInstance();

  return useMutation({
    mutationFn: ({ programId, videoId }: { programId: number; videoId: number }) =>
      getVideoStreamUrl(axiosInstance, programId, videoId),
  });
};
