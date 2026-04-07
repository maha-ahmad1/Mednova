"use client";

import { useMutation } from "@tanstack/react-query";
import { useAxiosInstance } from "@/lib/axios/axiosInstance";

export type ConsultationPaymentType = "chat" | "video";

interface CreatePaymentLinkInput {
  type: ConsultationPaymentType;
  consultationId: string | number;
  amount: number;
  payment_method: "card";
  card_type: "domestic";
}

interface CreatePaymentLinkResponse {
  success: boolean;
  data: {
    checkout_url: string;
    gateway_payment_id: number;
    biller_ref: string;
    expires_in_minutes: number;
  };
}

export const useCreatePaymentLink = () => {
  const axios = useAxiosInstance();

  return useMutation({
    mutationFn: async ({ type, consultationId, ...payload }: CreatePaymentLinkInput) => {
      const response = await axios.post<CreatePaymentLinkResponse>(
        `/api/consultation-request/payment-gateway/create-link-payment/${type}/${consultationId}`,
        payload,
      );

      return response.data;
    },
  });
};
