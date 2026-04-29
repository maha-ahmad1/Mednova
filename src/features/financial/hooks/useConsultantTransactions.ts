"use client";

import { useQuery } from "@tanstack/react-query";
import { useAxiosInstance } from "@/lib/axios/axiosInstance";
import { getConsultantTransactions } from "../api/consultant.api";
import type { ApiEnvelope, Transaction } from "../types";

export const useConsultantTransactions = (page = 1, perPage = 15) => {
  const axios = useAxiosInstance();

  return useQuery<ApiEnvelope<Transaction[]>, Error>({
    queryKey: ["financial", "consultant", "transactions", { page, perPage }],
    queryFn: () => getConsultantTransactions(axios, { page, per_page: perPage }),
    placeholderData: (prev) => prev,
    staleTime: 30_000,
  });
};
