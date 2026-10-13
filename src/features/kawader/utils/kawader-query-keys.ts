import type { AdminKawaderFilters, MyKawaderRequestsFilters } from "../types/kawader";

// Every key starts with ["kawader", locale] because the API returns localized labels.
// Keys nest under a shared prefix so invalidating e.g. ["kawader", locale, "my-requests"]
// refreshes every page and detail underneath it.
export const kawaderKeys = {
  all: (locale: string) => ["kawader", locale] as const,

  services: (locale: string) => [...kawaderKeys.all(locale), "services"] as const,

  myRequests: (locale: string) => [...kawaderKeys.all(locale), "my-requests"] as const,
  myRequestsList: (locale: string, filters: MyKawaderRequestsFilters) =>
    [...kawaderKeys.myRequests(locale), "list", filters] as const,
  myRequestDetail: (locale: string, id: number | string) =>
    [...kawaderKeys.myRequests(locale), "detail", String(id)] as const,

  adminRequests: (locale: string) => [...kawaderKeys.all(locale), "admin-requests"] as const,
  adminRequestsList: (locale: string, filters: AdminKawaderFilters) =>
    [...kawaderKeys.adminRequests(locale), "list", filters] as const,
  adminRequestDetail: (locale: string, id: number | string) =>
    [...kawaderKeys.adminRequests(locale), "detail", String(id)] as const,
};
