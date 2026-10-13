"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";
import { useAxiosInstance } from "@/lib/axios/axiosInstance";
import { getAdminKawaderRequests } from "../api";
import type {
  AdminKawaderFilters,
  AdminKawaderListItem,
  KawaderPagination,
} from "../types/kawader";
import { kawaderKeys } from "../utils/kawader-query-keys";

export function useAdminKawaderRequests(filters: AdminKawaderFilters = {}) {
  const axiosInstance = useAxiosInstance();
  const locale = useLocale();

  const query = useQuery({
    queryKey: kawaderKeys.adminRequestsList(locale, filters),
    queryFn: () => getAdminKawaderRequests(axiosInstance, filters),
    placeholderData: (previous) => previous,
  });

  const items: AdminKawaderListItem[] = useMemo(() => query.data?.data ?? [], [query.data]);
  const pagination: KawaderPagination | undefined = query.data?.pagination ?? undefined;

  return { ...query, items, pagination };
}
