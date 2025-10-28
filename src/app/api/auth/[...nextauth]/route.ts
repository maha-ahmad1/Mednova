import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { UserT } from "@/types/next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
        access_token: { label: "Access Token", type: "text" },
        user: { label: "User JSON", type: "text" },
      },
      async authorize(credentials) {
        if (credentials?.email && credentials?.password) {
          const res = await fetch(
            "https://demoapplication.jawebhom.com/api/auth/login",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: credentials.email,
                password: credentials.password,
              }),
            }
          );

          const data = await res.json();
          if (!res.ok || !data?.success) return null;

          const rawToken: string = data.data.access_token || "";
          const accessToken = rawToken.replace(/^Bearer\s+/i, "");

          const user: UserT = {
            id: String(data.data.user.id),
            full_name: data.data.user.full_name,
            email: data.data.user.email,
            phone: data.data.user.phone,
            type_account: data.data.user.type_account,
            birth_date: data.data.user.birth_date,
            gender: data.data.user.gender,
            image: data.data.user.image,
            accessToken,
          };

          return user;
        }

        if (credentials?.access_token && credentials?.user) {
          const user = JSON.parse(credentials.user) as UserT;
          const accessToken = credentials.access_token.replace(
            /^Bearer\s+/i,
            ""
          );

          return { ...user, accessToken };
        }

        return null;
      },
    }),
  ],

  pages: {
    signIn: "/auth/login",
  },

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        const typedUser = user as UserT;
        token.user = typedUser;
        token.accessToken = typedUser.accessToken ?? token.accessToken;
        token.role = typedUser.type_account;
      }

      if (trigger === "update" && session?.user) {
        token.user = {
          ...token.user,
          ...session.user,
        } as UserT;
        token.role = session.user.type_account ?? token.role;
      }

      return token;
    },

    async session({ session, token }) {
      session.user = token.user as UserT;
      session.accessToken = token.accessToken as string;
      session.role = token.role as string;
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
