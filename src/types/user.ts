export type UserRole = "therapist" | "center" | "patient"

export interface User {
  id: string
  full_name?: string
  email?: string
  image?: string
  role?: UserRole
}

declare module "next-auth" {
  interface Session {
    user?: User
  }
}
