import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useAxiosInstance } from "@/lib/axios/axiosInstance";
import { getBankAccount } from "../api/bankAccountApi";
import type { BankAccount } from "@/features/financial/types";

export const useBankAccount = () => {
  const axiosInstance = useAxiosInstance();

  return useQuery<BankAccount | null, Error>({
    queryKey: ["financial", "bank-account"],
    queryFn: async () => {
      try {
        const res = await getBankAccount(axiosInstance);
        const data = res.data;
        return { ...data, is_verified: data.status === "verified" };
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
          return null;
        }
        throw error;
      }
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
};
