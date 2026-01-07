// import { useQuery } from "@tanstack/react-query"
// import { useSession } from "next-auth/react"
// import { getProgramById } from "../api"

// export const useProgramQuery = (id: number) => {
//   const { data: session, status } = useSession()

//   return useQuery({
//     queryKey: ["program", id],
//     queryFn: () => getProgramById(id, session!.accessToken),
//     enabled: !!id && status === "authenticated",
//   })
// }
