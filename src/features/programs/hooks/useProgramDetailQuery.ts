"use client"

import { useQuery } from "@tanstack/react-query"
import { getProgramById } from "../api/getProgramById.api"
import { useSession } from "next-auth/react"

export const useProgramDetailQuery = (id: number) => {
      const { data: session, status } = useSession()
    
  return useQuery({
    queryKey: ["program", id],
    queryFn: () => getProgramById(id, session!.accessToken),
    enabled: !!id,
  })
}
