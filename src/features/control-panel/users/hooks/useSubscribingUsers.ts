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

export function useSubscribingUsers(page: number, perPage = 10) {
  const axiosInstance = useAxiosInstance();

  const query = useQuery<SubscribingUsersResponse, Error>({
    queryKey: ["subscribing-users", { page, perPage }],
    queryFn: async () =>
      getSubscribingUsers<SubscribingApiUser[]>(axiosInstance, {
        page,
        per_page: perPage,
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
