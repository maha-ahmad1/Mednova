import { useFetcher } from "@/hooks/useFetcher";
import type { WalletBalance } from "../types/wallet";

const WALLET_ENDPOINT = "/api/financial/consultant/wallet";

export const useConsultantWallet = () => {
  return useFetcher<WalletBalance>(
    ["financial", "consultant", "wallet"],
    WALLET_ENDPOINT
  );
};
