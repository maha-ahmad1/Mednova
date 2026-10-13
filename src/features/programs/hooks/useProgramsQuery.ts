import { useQuery } from "@tanstack/react-query"
import { useSession } from "next-auth/react"
import { useAxiosInstance } from "@/lib/axios/axiosInstance"
import { getPrograms } from "../api"

export const useProgramsQuery = () => {
  const axiosInstance = useAxiosInstance()
  const { data: session, status } = useSession()

  return useQuery({
    // is_enrolled depends on who is asking, so the user is part of the key and the request
    // waits for the session (otherwise it could go out without the token and be cached).
    queryKey: ["programs", session?.user?.id ?? "guest"],
    queryFn: () => getPrograms(axiosInstance),
    enabled: status !== "loading",
  })
}
