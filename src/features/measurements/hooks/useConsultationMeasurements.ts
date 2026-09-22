"use client";

import { useMemo } from "react";
import { useFetcher } from "@/hooks/useFetcher";
import type { Measurement } from "../types";

export const useConsultationMeasurements = (
  type: "video" | "chat",
  consultationId: number,
) => {
  const { data, isLoading } = useFetcher<Measurement[]>(
    ["measurements", type, consultationId],
    `/api/consultation-request/${type}/${consultationId}/measurements`,
  );

  const latest = useMemo(() => {
    if (!data || data.length === 0) return null;

    return data.reduce((mostRecent, measurement) =>
      new Date(measurement.created_at).getTime() >
      new Date(mostRecent.created_at).getTime()
        ? measurement
        : mostRecent,
    );
  }, [data]);

  return { latest, isLoading };
};
