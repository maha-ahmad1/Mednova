import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { routing } from "@/i18n/routing";
import { isRestrictedForIncompleteProfile } from "@/lib/routeConfig";

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
    (p) => cleanPath === p || cleanPath.startsWith(`${p}/`),
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

  const pathnameLocale = pathname.split("/")[1];
  const hasLocale = routing.locales.includes(
    pathnameLocale as (typeof routing.locales)[number],
  );

  const locale = hasLocale
    ? pathnameLocale
    : req.cookies.get("NEXT_LOCALE")?.value || routing.defaultLocale;

  if (!hasLocale) {
    url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
    const response = NextResponse.redirect(url);
    response.cookies.set("NEXT_LOCALE", locale, { path: "/" });
    return response;
  }

  const cleanPathname =
    pathname.replace(new RegExp(`^/(${routing.locales.join("|")})`), "") || "/";

  if (isAuthPublicPath(cleanPathname)) {
    return NextResponse.next();
  }

  // Fast-path: skip JWT decryption for unauthenticated visitors on non-protected routes.
  // Without a session cookie there is no token — getToken() would return null anyway.
  // Protected paths (/control-panel, /profile) always go through the full token check
  // so auth guards and pending/incomplete redirects are never bypassed.
  const isProtectedPath =
    cleanPathname.startsWith("/control-panel") ||
    cleanPathname.startsWith("/profile");

  const hasSessionCookie =
    req.cookies.has("next-auth.session-token") ||
    req.cookies.has("__Secure-next-auth.session-token");

  if (!hasSessionCookie && !isProtectedPath) {
    return NextResponse.next();
  }

  const token = (await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  })) as Token | null;

 if (cleanPathname.startsWith("/control-panel")) {
  if (!isAdminToken(token)) {
    url.pathname = `/${locale}/control-panel/login`;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

  if (!token && cleanPathname.startsWith("/profile")) {
    url.pathname = `/${locale}/login`;
    return NextResponse.redirect(url);
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
      // Only block restricted pages — public/general pages stay accessible
      if (
        !cleanPathname.startsWith("/profile/create") &&
        isRestrictedForIncompleteProfile(cleanPathname)
      ) {
        url.pathname = `/${locale}/profile/create`;
        return NextResponse.redirect(url);
      }
    } else if (approval_status === "pending") {
      if (!cleanPathname.startsWith("/profile/pending")) {
        url.pathname = `/${locale}/profile/pending`;
        return NextResponse.redirect(url);
      }
    } else if (approval_status === "approved") {
      if (
        cleanPathname.startsWith("/profile/create") ||
        cleanPathname.startsWith("/profile/pending")
      ) {
        url.pathname = `/${locale}/profile`;
        return NextResponse.redirect(url);
      }
    } else if (approval_status === "rejected") {
      if (
        !cleanPathname.startsWith("/profile/rejected") &&
        isRestrictedForIncompleteProfile(cleanPathname)
      ) {
        url.pathname = `/${locale}/profile/rejected`;
        return NextResponse.redirect(url);
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next|images|favicon.ico).*)"],
};
