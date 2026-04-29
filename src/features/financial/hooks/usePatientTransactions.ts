"use client";

import { useQuery } from "@tanstack/react-query";
import { useAxiosInstance } from "@/lib/axios/axiosInstance";
import { getPatientTransactions } from "../api/patient.api";
import type { ApiEnvelope, Transaction } from "../types";

export const usePatientTransactions = (page = 1, perPage = 15) => {
  const axios = useAxiosInstance();

  return useQuery<ApiEnvelope<Transaction[]>, Error>({
    queryKey: ["financial", "patient", "transactions", { page, perPage }],
    queryFn: () => getPatientTransactions(axios, { page, per_page: perPage }),
    placeholderData: (prev) => prev,
    staleTime: 30_000,
    refetchOnWindowFocus: false
  });
};
