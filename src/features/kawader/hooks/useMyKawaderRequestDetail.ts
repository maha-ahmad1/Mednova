"use client";

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useLocale } from "next-intl";
import { useAxiosInstance } from "@/lib/axios/axiosInstance";
import { getMyKawaderRequestById } from "../api";
import { kawaderKeys } from "../utils/kawader-query-keys";
import { shouldRetryKawaderQuery } from "../utils/kawader-retry";

// Same key and same cached shape (the unwrapped request) as a `useFetcher` detail hook, but
// built on `useQuery` so the retry policy can apply.
export function useMyKawaderRequestDetail(id: number | string | null | undefined) {
  const axiosInstance = useAxiosInstance();
  const locale = useLocale();
  const { status } = useSession();
  const hasId = id !== null && id !== undefined && id !== "";

  return useQuery({
    queryKey: kawaderKeys.myRequestDetail(locale, hasId ? id : ""),
    queryFn: async () => (await getMyKawaderRequestById(axiosInstance, id as number | string)).data,
    enabled: hasId && status === "authenticated",
    retry: shouldRetryKawaderQuery,
  });
}
