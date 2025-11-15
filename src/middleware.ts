import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

interface TokenUser {
  id?: string;
  type_account?: string;
  isCompleted?: boolean;
  // possible snake_case fields present in some tokens
  is_completed?: boolean;
  status?: string;
}

interface Token {
  user?: TokenUser;
  role?: string;
  isCompleted?: boolean;
  // token may include snake_case fields depending on backend
  is_completed?: boolean;
  status?: string;
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
    console.log("🚫 No token found, redirecting to /login");

    url.pathname = "/login";
    return NextResponse.redirect(url);
  }
  console.log(" bS===");

  if (token) {
    const isCompleted = token.is_completed ?? token.isCompleted ?? token.user?.is_completed ?? token.user?.isCompleted ?? false;
    const status = token.status ?? token.user?.status ?? undefined;
    console.log("status" + status);

    if (!isCompleted) {
      if (!pathname.startsWith("/profile/create")) {
        url.pathname = "/profile/create";
        return NextResponse.redirect(url);
      }
    } else if (status === "not_active") {
      if (!pathname.startsWith("/profile/pending")) {
        url.pathname = "/profile/pending";
        return NextResponse.redirect(url);
      }
    } else if (status === "active") {
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
