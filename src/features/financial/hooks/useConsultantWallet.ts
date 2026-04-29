import { useFetcher } from "@/hooks/useFetcher";
import type { ConsultantWallet } from "../types";

export const useConsultantWallet = () => {
  return useFetcher<ConsultantWallet>(
    ["financial", "consultant", "wallet"],
    "/api/financial/consultant/wallet",
    { staleTime: 0.5 },
  );
};
