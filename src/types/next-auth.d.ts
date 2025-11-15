import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    user?: ({
      id: string;
      full_name: string;
      email: string;
      phone: string;
      type_account: string;
      birth_date?: string | null;
      gender?: string | null;
      image?: string | null;
      isCompleted?: boolean
      role?: string
      status?: string
      // legacy snake_case fields sometimes present on JWT/session
      is_completed?: boolean
    } & DefaultSession["user"]);
    // top-level session convenience flags
    isCompleted?: boolean
    role?: string
  }

  interface User extends DefaultUser {
    id: string;
    full_name: string;
    email: string;
    phone: string;
    type_account: string;
    birth_date?: string | null;
    gender?: string | null;
    image?: string | null;
    accessToken?: string;
    role?: string;
    status?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    user?: {
      id: string;
      full_name: string;
      email: string;
      phone: string;
      type_account: string;
      birth_date?: string | null;
      gender?: string | null;
      image?: string | null;
      role?: string;
      status?: string;
      is_completed?: boolean;
    };
  }
}



export interface UserT {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  type_account: string;
  birth_date?: string | null;
  gender?: string | null;
  image?: string | null;
  accessToken?: string;
  isCompleted?: boolean
}



