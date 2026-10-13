"use client";

import { useMutation } from "@tanstack/react-query";
import { useAxiosInstance } from "@/lib/axios/axiosInstance";
import { createProgramPaymentLink } from "../api";
import type { ProgramPaymentLinkPayload } from "../types/purchase";

interface CreateProgramPaymentLinkInput {
  purchaseId: number;
  payload: ProgramPaymentLinkPayload;
}

export const useProgramPaymentLink = () => {
  const axiosInstance = useAxiosInstance();

  return useMutation({
    mutationFn: ({ purchaseId, payload }: CreateProgramPaymentLinkInput) =>
      createProgramPaymentLink(axiosInstance, purchaseId, payload),
  });
};
