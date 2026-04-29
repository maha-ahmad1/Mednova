import { useFetcher } from "@/hooks/useFetcher";
import type { PatientWallet } from "../types";

export const usePatientWallet = () => {
  return useFetcher<PatientWallet>(
    ["financial", "patient", "wallet"],
    "/api/financial/patient/wallet",
    { staleTime: 0.5 },
  );
};
