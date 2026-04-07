"use client";

import { useQuery } from "@tanstack/react-query";
import { useAxiosInstance } from "@/lib/axios/axiosInstance";
import {
  extractPaymentStatus,
  type PaymentStatus,
} from "@/features/payment/utils/paymentStatus";

interface ConsultationApiResponse {
  success: boolean;
  data: Array<Record<string, unknown>>;
}

interface UsePaymentStatusOptions {
  consultationId?: string | number;
  enabled?: boolean;
}

export const usePaymentStatus = ({
  consultationId,
  enabled = true,
}: UsePaymentStatusOptions) => {
  const axios = useAxiosInstance();

  return useQuery({
    queryKey: ["consultation", "payment-status", consultationId],
    enabled: Boolean(consultationId) && enabled,
    queryFn: async () => {
      const response = await axios.get<ConsultationApiResponse>(
        "/api/consultation-request/get-status-request",
        {
          params: {
            limit: 30,
            consultation_id: consultationId,
          },
        },
      );

      const collection = Array.isArray(response.data?.data) ? response.data.data : [];
      const consultation = collection.find((item) => String(item.id) === String(consultationId));

      const status: PaymentStatus = extractPaymentStatus(consultation);

      return {
        consultation,
        status,
      };
    },
    refetchInterval: (query) =>
      query.state.data?.status === "pending" ? 15000 : false,
  });
};
