"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAxiosInstance } from "@/lib/axios/axiosInstance";
import { getSubscribingUsers } from "../api/usersManagement.api";
import type { SubscribingApiUser } from "../types/user";
import { mapApiSubscribingUser } from "../utils/users";

interface SubscribingUsersResponse {
  success: boolean;
  message: string;
  data: SubscribingApiUser[];
  status: string;
}

export function useSubscribingUsers() {
  const axiosInstance = useAxiosInstance();

  const query = useQuery<SubscribingUsersResponse, Error>({
    queryKey: ["subscribing-users"],
    queryFn: async () => getSubscribingUsers<SubscribingApiUser[]>(axiosInstance),
  });

  const users = useMemo(
    () => (query.data?.data ?? []).map((user) => mapApiSubscribingUser(user)),
    [query.data?.data],
  );

  return {
    ...query,
    users,
  };
}
