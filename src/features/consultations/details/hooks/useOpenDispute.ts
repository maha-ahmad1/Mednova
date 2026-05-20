"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAxiosInstance } from "@/lib/axios/axiosInstance";
import { openDispute } from "../api/disputeApi";

interface OpenDisputeInput {
  consultationType: "video" | "chat";
  queryId: string;
  reason: string;
}

export function useOpenDispute() {
  const axios = useAxiosInstance();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ queryId, consultationType, reason }: OpenDisputeInput) =>
      openDispute(axios, Number(queryId), { type: consultationType, reason_dispute: reason }),
    onSuccess: (_, { queryId, consultationType }) => {
      queryClient.invalidateQueries({
        queryKey: ["consultation", "details", queryId, consultationType],
      });
    },
  });
}
