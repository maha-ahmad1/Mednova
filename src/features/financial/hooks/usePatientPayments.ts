"use client";

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useAxiosInstance } from "@/lib/axios/axiosInstance";
import { getPatientPayments } from "../api/patient.api";
import type { ApiEnvelope, PatientPayment } from "../types";

export const usePatientPayments = (page = 1, perPage = 15) => {
  const axios = useAxiosInstance();
  const { status } = useSession();

  return useQuery<ApiEnvelope<PatientPayment[]>, Error>({
    queryKey: ["financial", "patient", "payments", { page, perPage }],
    queryFn: () => getPatientPayments(axios, { page, per_page: perPage }),
    enabled: status === "authenticated",
    placeholderData: (prev) => prev,
    staleTime: 30_000,
  });
};
