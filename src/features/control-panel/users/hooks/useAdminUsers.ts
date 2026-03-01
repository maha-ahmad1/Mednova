"use client";

import { useMemo } from "react";
import { useFetcher } from "@/hooks/useFetcher";
import type { UsersApiUser, UsersFilters } from "../types/user";
import { buildUsersQueryParams, mapApiUserToAdminUser } from "../utils/users";

export function useAdminUsers(filters: UsersFilters) {
  const params = useMemo(() => buildUsersQueryParams(filters), [filters]);

  const query = useFetcher<UsersApiUser[], Record<string, string | number>>(
    ["admin-users"],
    "/api/control-panel/users",
    {
      params,
    },
  );

  const users = useMemo(
    () => (query.data ?? []).map((user) => mapApiUserToAdminUser(user)),
    [query.data],
  );

  return {
    ...query,
    users,
  };
}
