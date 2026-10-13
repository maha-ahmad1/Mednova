"use client";

import { useLocale } from "next-intl";
import { useFetcher } from "@/hooks/useFetcher";
import type { KawaderServicesResponse } from "../types/kawader";
import { kawaderKeys } from "../utils/kawader-query-keys";

// Service names/hints are localized, so the locale is part of the key.
export function useKawaderServices() {
  const locale = useLocale();

  return useFetcher<KawaderServicesResponse>(kawaderKeys.services(locale), "/api/kawader/services");
}
