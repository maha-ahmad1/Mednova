// File: src/app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import { authOptions } from "@/lib/authOptions";

const handler = NextAuth(authOptions);

// تصدير handler لجميع طرق HTTP المطلوبة من Next.js App Router
export { handler as GET, handler as POST };
