import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const locales = ["en", "ar"] as const;
const defaultLocale = "en";

const LOCALE_HEADER = "x-locale";

function nextWithLocale(req: NextRequest, locale: string) {
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set(LOCALE_HEADER, locale);
  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}

/** Paths without locale prefix (e.g. /ar/login → /login) */
function isAuthPublicPath(cleanPath: string): boolean {
  const exactOrPrefix = [
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
    "/code-verification",
    "/control-panel/login",
  ];
  return exactOrPrefix.some(
    (p) => cleanPath === p || cleanPath.startsWith(`${p}/`)
  );
}

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

  return (
    token.role === "admin" ||
    token.user?.type_account === "admin" ||
    token.user?.role === "admin"
  );
};

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const pathname = req.nextUrl.pathname;

  const pathnameHasLocale = locales.some(
    (locale) =>
      pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  let locale: string = req.cookies.get("NEXT_LOCALE")?.value || defaultLocale;
  const pathnameLocale = pathname.match(/^\/(en|ar)(\/|$)/)?.[1];
  if (pathnameLocale) {
    locale = pathnameLocale;
  }

  if (!pathnameHasLocale) {
    url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
    const response = NextResponse.redirect(url);
    response.cookies.set("NEXT_LOCALE", locale, { path: "/" });
    return response;
  }

  const cleanPathname =
    pathname.replace(/^\/(en|ar)/, "") || "/";

  if (isAuthPublicPath(cleanPathname)) {
    const res = nextWithLocale(req, locale);
    res.cookies.set("NEXT_LOCALE", locale, { path: "/" });
    return res;
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
      url.pathname = `/${locale}/control-panel/login`;
      const response = NextResponse.redirect(url);
      response.cookies.set("NEXT_LOCALE", locale, { path: "/" });
      return response;
    }

    return nextWithLocale(req, locale);
  }

  if (!token && cleanPathname.startsWith("/profile")) {
    url.pathname = `/${locale}/login`;
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
        url.pathname = `/${locale}/profile/create`;
        const response = NextResponse.redirect(url);
        response.cookies.set("NEXT_LOCALE", locale, { path: "/" });
        return response;
      }
    } else if (approval_status === "pending") {
      if (!cleanPathname.startsWith("/profile/pending")) {
        url.pathname = `/${locale}/profile/pending`;
        const response = NextResponse.redirect(url);
        response.cookies.set("NEXT_LOCALE", locale, { path: "/" });
        return response;
      }
    } else if (approval_status === "approved") {
      if (
        cleanPathname.startsWith("/profile/create") ||
        cleanPathname.startsWith("/profile/pending")
      ) {
        url.pathname = `/${locale}/profile`;
        const response = NextResponse.redirect(url);
        response.cookies.set("NEXT_LOCALE", locale, { path: "/" });
        return response;
      }
    }
  }

  return nextWithLocale(req, locale);
}

export const config = {
  matcher: ["/((?!api|_next|images|favicon.ico).*)"],
};
