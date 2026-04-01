"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAxiosInstance } from "@/lib/axios/axiosInstance";
import { getSubscribingUsers } from "../api/usersManagement.api";
import type { PaginationMeta, SubscribingApiUser } from "../types/user";
import { mapApiSubscribingUser } from "../utils/users";

interface SubscribingUsersResponse {
  success: boolean;
  message: string;
  data: SubscribingApiUser[];
  pagination?: PaginationMeta;
  status: string;
}

interface SubscribingUsersFilters {
  search: string;
  type: "all" | "Specialist" | "Center";
}

export function useSubscribingUsers(
  page: number,
  perPage = 10,
  filters: SubscribingUsersFilters = { search: "", type: "all" },
) {
  const axiosInstance = useAxiosInstance();

  const query = useQuery<SubscribingUsersResponse, Error>({
    queryKey: ["subscribing-users", { page, perPage, ...filters }],
    queryFn: async () =>
      getSubscribingUsers<SubscribingApiUser[]>(axiosInstance, {
        page,
        per_page: perPage,
        ...(filters.search.trim() ? { search: filters.search.trim() } : {}),
        ...(filters.type === "Specialist"
          ? { type_account: "therapist" as const }
          : filters.type === "Center"
            ? { type_account: "rehabilitation_center" as const }
            : {}),
      }),
  });

  const users = useMemo(
    () => (query.data?.data ?? []).map((user) => mapApiSubscribingUser(user)),
    [query.data?.data],
  );

  return {
    ...query,
    users,
    pagination: query.data?.pagination,
  };
}
