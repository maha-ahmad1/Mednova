import NextAuth, { type NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import type { UserT } from "@/types/next-auth"

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
          const res = await fetch("https://api.mednovacare.com/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          })

          const data = await res.json()
          if (!res.ok || !data?.success) return null

          const rawToken: string = data.data.access_token || ""
          const accessToken = rawToken.replace(/^Bearer\s+/i, "")

          const user = data.data.user

          // const isCompleted = Boolean(
          //   user.phone && user.gender && user.birth_date
          // );

          const typedUser: UserT = {
            id: String(user.id),
            full_name: user.full_name,
            email: user.email,
            phone: user.phone,
            type_account: user.type_account,
            birth_date: user.birth_date,
            gender: user.gender,
            image: user.image,
            accessToken,
            // isCompleted: Boolean(user.is_completed),
          }
            console.log("user" +user)
          return typedUser
        }

        if (credentials?.access_token && credentials?.user) {
          const user = JSON.parse(credentials.user) as UserT
          const accessToken = credentials.access_token.replace(/^Bearer\s+/i, "")
          return { ...user, accessToken }
        }

        return null
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

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        const typedUser = user as UserT
        token.user = typedUser
        token.accessToken = typedUser.accessToken ?? token.accessToken
        token.role = typedUser.type_account
        // token.isCompleted = typedUser.isCompleted
      }

      if (trigger === "update" && session?.user) {
        token.user = {
          ...token.user,
          ...session.user,
        } as UserT
        token.role = session.user.type_account ?? token.role
        // token.isCompleted = session.user.isCompleted ?? token.isCompleted
      }

      return token
    },

    async session({ session, token }) {
      session.user = token.user as UserT
      session.accessToken = token.accessToken as string
      session.role = token.role as string
      session.isCompleted = token.isCompleted as boolean
      return session
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }
