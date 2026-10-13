"use client";

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useLocale } from "next-intl";
import { useAxiosInstance } from "@/lib/axios/axiosInstance";
import { getAdminKawaderRequestById } from "../api";
import { kawaderKeys } from "../utils/kawader-query-keys";
import { shouldRetryKawaderQuery } from "../utils/kawader-retry";

// The cached value is the unwrapped request (A2's `data`). `useChangeKawaderRequestStatus`
// writes the A3 response into this exact key (`kawaderKeys.adminRequestDetail`).
export function useAdminKawaderRequestDetail(id: number | string | null | undefined) {
  const axiosInstance = useAxiosInstance();
  const locale = useLocale();
  const { status } = useSession();
  const hasId = id !== null && id !== undefined && id !== "";

  return useQuery({
    queryKey: kawaderKeys.adminRequestDetail(locale, hasId ? id : ""),
    queryFn: async () => (await getAdminKawaderRequestById(axiosInstance, id as number | string)).data,
    enabled: hasId && status === "authenticated",
    retry: shouldRetryKawaderQuery,
  });
}
