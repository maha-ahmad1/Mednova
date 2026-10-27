"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";
import { useAxiosInstance } from "@/lib/axios/axiosInstance";
import { getMyKawaderRequests } from "../api";
import type {
  KawaderPagination,
  KawaderRequest,
  MyKawaderRequestsFilters,
} from "../types/kawader";
import { kawaderKeys } from "../utils/kawader-query-keys";

export function useMyKawaderRequests(filters: MyKawaderRequestsFilters = {}) {
  const axiosInstance = useAxiosInstance();
  const locale = useLocale();

  const query = useQuery({
    queryKey: kawaderKeys.myRequestsList(locale, filters),
    queryFn: () => getMyKawaderRequests(axiosInstance, filters),
    // Keep the old page while paging/filtering, but not across tabs: showing "Current"
    // requests under the "Previous" tab while it loads would be misleading.
    placeholderData: (previous, previousQuery) => {
      const previousFilters = previousQuery?.queryKey.at(-1) as MyKawaderRequestsFilters | undefined;
      return previousFilters?.scope === filters.scope ? previous : undefined;
    },
  });

  const items: KawaderRequest[] = useMemo(() => query.data?.data ?? [], [query.data]);
  const pagination: KawaderPagination | undefined = query.data?.pagination ?? undefined;

  return { ...query, items, pagination };
}
