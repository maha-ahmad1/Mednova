export type UserRole = "therapist" | "center" | "patient"

export interface User {
  id: string
  full_name?: string
  email?: string
  image?: string
  role?: UserRole
}
// Note: `next-auth` module augmentation is defined in `src/types/next-auth.d.ts`.
// This file only exports the local `User` types used across the app to avoid
// duplicate module augmentation declarations which cause TS errors.
