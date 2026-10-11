"use client"

import { useQuery } from "@tanstack/react-query"
import { useSession } from "next-auth/react"
import { useAxiosInstance } from "@/lib/axios/axiosInstance"
import { getProgramById } from "../api/getProgramById.api"

export const useProgramDetailQuery = (id: number) => {
  const axiosInstance = useAxiosInstance()
  const { data: session, status } = useSession()

  return useQuery({
    // The response depends on who is asking (is_locked / is_enrolled), so the user is part of
    // the key — a guest copy cached before login must never be served to a subscriber.
    queryKey: ["program", id, session?.user?.id ?? "guest"],
    queryFn: () => getProgramById(axiosInstance, id),
    // Wait for the session so the first request doesn't go out without the token.
    enabled: !!id && status !== "loading",
    refetchOnMount: "always",
  })
}
