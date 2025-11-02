import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

interface TokenUser {
  id?: string;
  type_account?: string;
  isCompleted?: boolean;
}

interface Token {
  user?: TokenUser;
  role?: string;
  isCompleted?: boolean;
  accessToken?: string;
}

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const pathname = req.nextUrl.pathname;

  const publicPaths = [
    "/login",
    "/api/auth",
    "/_next",
    "/favicon.ico",
    "/public",
  ];
  if (publicPaths.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  const token = (await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  })) as Token | null;

  console.log("🔐 Full Token:", token);

  if (!token && pathname.startsWith("/profile")) {
    console.log("🚫 No token found, redirecting to /auth/login");

    url.pathname = "/login";
    return NextResponse.redirect(url);
  }
  console.log(" bS===");

  if (token) {
    const isCompleted = token.is_completed ?? token.user?.is_completed ?? false;
    const status = token.status ?? token.user?.status;
    console.log("status" + status);

    if (!isCompleted) {
      // لم يملأ البيانات بعد
      if (!pathname.startsWith("/profile/create")) {
        url.pathname = "/profile/create";
        return NextResponse.redirect(url);
      }
    } else if (status === "not_active") {
      // مكتمل البيانات لكن لم يفعل بعد
      if (!pathname.startsWith("/profile/pending")) {
        url.pathname = "/profile/pending";
        return NextResponse.redirect(url);
      }
    } else if (status === "active") {
      // مفعل بالكامل
      if (
        pathname.startsWith("/profile/create") ||
        pathname.startsWith("/profile/pending")
      ) {
        url.pathname = "/profile";
        return NextResponse.redirect(url);
      }
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*"],
};
