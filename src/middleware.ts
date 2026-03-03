import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

interface TokenUser {
  id?: string;
  type_account?: string;
  role?: string;
  isCompleted?: boolean;
  is_completed?: boolean;
  approval_status?: string;
}

interface Token {
  user?: TokenUser;
  role?: string;
  isCompleted?: boolean;
  is_completed?: boolean;
  approval_status?: string;
  accessToken?: string;
}

const isAdminToken = (token: Token | null): boolean => {
  if (!token) {
    return false;
  }

  return token.role === "admin" || token.user?.type_account === "admin" || token.user?.role === "admin";
};

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const pathname = req.nextUrl.pathname;

  const publicPaths = ["/login", "/admin/login", "/api/auth", "/_next", "/favicon.ico", "/public"];
  if (publicPaths.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  const token = (await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  })) as Token | null;

  if (pathname.startsWith("/admin/users") || pathname.startsWith("/admin/programs")) {
    if (!isAdminToken(token)) {

      
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  }

  if (!token && pathname.startsWith("/profile")) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (token) {
    const isCompleted =
      token.is_completed ?? token.isCompleted ?? token.user?.is_completed ?? token.user?.isCompleted ?? false;
    const approval_status = token.approval_status ?? token.user?.approval_status ?? undefined;

    if (!isCompleted) {
      if (!pathname.startsWith("/profile/create")) {
        url.pathname = "/profile/create"; //يعدل مسار الـ URL object
        return NextResponse.redirect(url); //يطلب من المتصفح يروح على الرابط الجديد
      }
    } else if (approval_status === "pending") {
      if (!pathname.startsWith("/profile/pending")) {
        url.pathname = "/profile/pending";
        return NextResponse.redirect(url);
      }
    } else if (approval_status === "approved") {
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
  matcher: ["/profile/:path*", "/admin/users/:path*", "/admin/programs/:path*"],
};
