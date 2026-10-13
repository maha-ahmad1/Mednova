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
    placeholderData: (previous) => previous,
  });

  const items: KawaderRequest[] = useMemo(() => query.data?.data ?? [], [query.data]);
  const pagination: KawaderPagination | undefined = query.data?.pagination ?? undefined;

  return { ...query, items, pagination };
}
