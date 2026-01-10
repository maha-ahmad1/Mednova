import { useQuery } from "@tanstack/react-query"
import { useSession } from "next-auth/react"
import { getPrograms } from "../api"

export const useProgramsQuery = () => {
  const { data: session, status } = useSession()

  return useQuery({
    queryKey: ["programs"],
    queryFn: () => getPrograms(session?.accessToken),
    enabled: status === "authenticated",
  })
}
