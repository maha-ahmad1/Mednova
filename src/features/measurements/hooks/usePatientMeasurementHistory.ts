"use client";

import { useQuery } from "@tanstack/react-query";
import { useAxiosInstance } from "@/lib/axios/axiosInstance";
import { getPatientMeasurementHistory } from "../api/measurementApi";
import type { Measurement, PaginatedMeasurementEnvelope } from "../types";

// per_page is fixed for this view — the API defaults to 15 and caps at 50
// server-side (measurement-api.md section 5), so 15 stays within that cap.
const PATIENT_HISTORY_PER_PAGE = 10;

// Uses useQuery directly (not useFetcher) because the caller needs the
// pagination metadata alongside the list, not just the unwrapped `data`.
export const usePatientMeasurementHistory = (patientId: number, page = 1) => {
  const axios = useAxiosInstance();

  return useQuery<PaginatedMeasurementEnvelope<Measurement[]>, Error>({
    queryKey: ["measurements", "patient-history", patientId, page],
    queryFn: () =>
      getPatientMeasurementHistory(axios, patientId, {
        page,
        per_page: PATIENT_HISTORY_PER_PAGE,
      }),
    placeholderData: (prev) => prev,
    staleTime: 30_000,
  });
};
