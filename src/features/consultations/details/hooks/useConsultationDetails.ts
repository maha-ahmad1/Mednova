import { useFetcher } from "@/hooks/useFetcher";
import type { ConsultationDetails } from "@/features/payment/types";

export function useConsultationDetails(id: string, type: "video" | "chat") {
  return useFetcher<ConsultationDetails>(
    ["consultation", "details", id, type],
    `/api/consultation-request/consultant/${id}/${type}`,
  );
}
