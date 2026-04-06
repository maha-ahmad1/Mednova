import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const locales = ["en", "ar"];
const defaultLocale = "en";

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

  const pathnameHasLocale = locales.some(
    (locale) =>
      pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  let locale = req.cookies.get("NEXT_LOCALE")?.value || defaultLocale;
  // Extract locale from pathname if present
  const pathnameLocale = pathname.match(/^\/(en|ar)(\/|$)/)?.[1];
  if (pathnameLocale) {
    locale = pathnameLocale;
  }

  if (!pathnameHasLocale) {
    url.pathname = `/${locale}${pathname}`;
    const response = NextResponse.redirect(url);
    response.cookies.set("NEXT_LOCALE", locale, { path: "/" });
    return response;
  }

  const cleanPathname = pathnameHasLocale
    ? pathname.replace(/^\/(en|ar)/, "") || "/"
    : pathname;
  const publicPaths = ["/login", "/control-panel/login", "/api/auth", "/_next", "/favicon.ico", "/public", "/images"];
  if (publicPaths.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  const token = (await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  })) as Token | null;

  if (
    cleanPathname.startsWith("/control-panel/users") ||
    cleanPathname.startsWith("/control-panel/programs")
  ) {
    if (!isAdminToken(token)) {
      url.pathname = locale === "ar" ? "/ar/control-panel/login" : "/control-panel/login";
      const response = NextResponse.redirect(url);
      response.cookies.set("NEXT_LOCALE", locale, { path: "/" });
      return response;
    }

    return NextResponse.next();
  }

  if (!token && cleanPathname.startsWith("/profile")) {
    url.pathname = locale === "ar" ? "/ar/login" : "/login";
    const response = NextResponse.redirect(url);
    response.cookies.set("NEXT_LOCALE", locale, { path: "/" });
    return response;
  }

  if (token) {
    const isCompleted =
      token.is_completed ??
      token.isCompleted ??
      token.user?.is_completed ??
      token.user?.isCompleted ??
      false;
    const approval_status =
      token.approval_status ?? token.user?.approval_status;

    if (!isCompleted) {
      if (!cleanPathname.startsWith("/profile/create")) {
        url.pathname =
          locale === "ar" ? "/ar/profile/create" : "/profile/create";
        const response = NextResponse.redirect(url);
        response.cookies.set("NEXT_LOCALE", locale, { path: "/" });
        return response;
      }
    } else if (approval_status === "pending") {
      if (!cleanPathname.startsWith("/profile/pending")) {
        url.pathname =
          locale === "ar" ? "/ar/profile/pending" : "/profile/pending";
        const response = NextResponse.redirect(url);
        response.cookies.set("NEXT_LOCALE", locale, { path: "/" });
        return response;
      }
    } else if (approval_status === "approved") {
      if (
        cleanPathname.startsWith("/profile/create") ||
        cleanPathname.startsWith("/profile/pending")
      ) {
        url.pathname = locale === "ar" ? "/ar/profile" : "/profile";
        const response = NextResponse.redirect(url);
        response.cookies.set("NEXT_LOCALE", locale, { path: "/" });
        return response;
      }
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next|images|favicon.ico).*)'
  ]
};
