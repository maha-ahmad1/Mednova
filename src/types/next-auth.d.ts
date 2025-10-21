import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
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
    } & DefaultSession["user"];
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
}
