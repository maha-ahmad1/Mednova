"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAxiosInstance } from "@/lib/axios/axiosInstance";
import type { PaginationMeta, UsersApiResponse, UsersFilters } from "../types/user";
import { buildUsersQueryParams, mapApiUserToAdminUser } from "../utils/users";

export function useAdminUsers(filters: UsersFilters, page: number, perPage = 10) {
  const axiosInstance = useAxiosInstance();

  const params = useMemo(
    () => buildUsersQueryParams(filters, { page, per_page: perPage }),
    [filters, page, perPage],
  );

  const query = useQuery<UsersApiResponse, Error>({
    queryKey: ["admin-users", params],
    queryFn: async () => {
      const response = await axiosInstance.get<UsersApiResponse>("/api/control-panel/users", {
        params,
      });

      return response.data;
    },
  });

  const users = useMemo(
    () => (query.data?.data ?? []).map((user) => mapApiUserToAdminUser(user)),
    [query.data?.data],
  );

  return {
    ...query,
    users,
    pagination: query.data?.pagination as PaginationMeta | undefined,
  };
}
