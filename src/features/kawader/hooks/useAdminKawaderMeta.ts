"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useLocale } from "next-intl";
import { useAxiosInstance } from "@/lib/axios/axiosInstance";
import { getAdminKawaderMeta } from "../api";
import type { AdminKawaderMeta } from "../types/kawader";
import { kawaderKeys } from "../utils/kawader-query-keys";
import { shouldRetryKawaderQuery } from "../utils/kawader-retry";

const META_STALE_TIME_MS = 60 * 60 * 1000;

/**
 * Admin filter options and labels (services, areas, statuses, priorities). Labels follow
 * Accept-Language, so the locale is part of the key. Lookups are always by `key`.
 */
export function useAdminKawaderMeta() {
  const axiosInstance = useAxiosInstance();
  const locale = useLocale();
  const { status } = useSession();

  const query = useQuery({
    queryKey: kawaderKeys.adminMeta(locale),
    queryFn: async () => (await getAdminKawaderMeta(axiosInstance)).data,
    enabled: status === "authenticated",
    staleTime: META_STALE_TIME_MS,
    retry: shouldRetryKawaderQuery,
    refetchOnWindowFocus: false,
  });

  const meta: AdminKawaderMeta | undefined = query.data;

  const lookups = useMemo(
    () => ({
      statusLabels: new Map((meta?.statuses ?? []).map((item) => [item.key, item.label])),
    }),
    [meta],
  );

  /** Label for a status key; an unknown key (or meta not loaded yet) shows the raw key. */
  const getStatusLabel = (key: string): string => lookups.statusLabels.get(key) ?? key;

  return { ...query, meta, getStatusLabel };
}
