"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAxiosInstance } from "@/lib/axios/axiosInstance";
import { getAdminDisputes } from "../api/disputesApi";
import type { DisputeStatus, Dispute, DisputesSummary, PaginationMeta } from "../types";

export function useAdminDisputes(
  status: DisputeStatus | "all",
  page: number,
  perPage = 15,
) {
  const axiosInstance = useAxiosInstance();

  const query = useQuery({
    queryKey: ["admin-disputes", { status, page, perPage }],
    queryFn: () => getAdminDisputes(axiosInstance, { status, page, per_page: perPage }),
    placeholderData: (prev) => prev,
  });

  const disputes: Dispute[] = useMemo(
    () => query.data?.data?.data ?? [],
    [query.data],
  );

  const summary: DisputesSummary | undefined = useMemo(
    () => query.data?.data?.summary,
    [query.data],
  );

  const pagination: PaginationMeta | undefined = useMemo(
    () => query.data?.pagination ?? undefined,
    [query.data],
  );

  return { ...query, disputes, summary, pagination };
}
