import { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getTranslations } from "next-intl/server";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import type { UserT } from "@/types/next-auth";

export const authOptions: NextAuthOptions = {
        providers: [
          CredentialsProvider({
            name: "Credentials",
            credentials: {
              email: { label: "Email", type: "text" },
              password: { label: "Password", type: "password" },
              access_token: { label: "Access Token", type: "text" },
              user: { label: "User JSON", type: "text" },
              login_context: { label: "Login Context", type: "text" },
            },
            async authorize(credentials) {
              if (credentials?.email && credentials?.password) {
                const isControlPanelLogin =
                  credentials.login_context === "control-panel";
                const loginUrl = isControlPanelLogin
                  ? "https://api.mednovacare.com/api/control-panel/auth/login"
                  : "https://api.mednovacare.com/api/auth/login";

                const res = await fetch(loginUrl, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    email: credentials.email,
                    password: credentials.password,
                  }),
                });

                const data = await res.json();
                if (!res.ok || !data?.success) return null;

                const payload = data.data ?? {};
                const rawToken: string =
                  payload.access_token ??
                  payload.token ??
                  payload.accessToken ??
                  payload?.data?.access_token ??
                  "";
                const accessToken = String(rawToken).replace(/^Bearer\s+/i, "");

                const user = payload.user ?? payload.admin ?? payload;

                const typedUser: UserT = {
                  id: String(user.id),
                  full_name: user.full_name ?? user.name ?? "Admin",
                  email: user.email,
                  phone: user.phone ?? "",
                  type_account: isControlPanelLogin ? "admin" : user.type_account,
                  birth_date: user.birth_date,
                  gender: user.gender,
                  image: user.image,
                  accessToken,
                };

                return typedUser;
              }

              if (credentials?.access_token && credentials?.user) {
                const user = JSON.parse(credentials.user) as UserT;
                const accessToken = credentials.access_token.replace(
                  /^Bearer\s+/i,
                  "",
                );
                return { ...user, accessToken };
              }

              return null;
            },
          }),
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
          }),
          FacebookProvider({
            clientId: process.env.FACEBOOK_CLIENT_ID!,
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
          }),
        ],

        pages: {
          signIn: "/login",
        },
        callbacks: {
          async jwt({ token, user, trigger }) {
            if (user) {
              const typedUser = user as UserT;
              token.accessToken = typedUser.accessToken;
              token.role = typedUser.type_account;
              token.approval_status = typedUser.approval_status;
            }

            if (trigger === "update" && token.user) {
              token.user.image = token.image;
              token.role = token.role;
              token.approval_status = token.approval_status;
            }

            return token;
          },
          async session({ session, token }) {
            if (token) {
              session.user = token.user as UserT;
              session.accessToken = token.accessToken as string | undefined;
              session.role = token.role as string | undefined;
              session.approval_status = token.approval_status as string | undefined;
            }
            return session;
          },
        },
      }
