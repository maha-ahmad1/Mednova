"use client";

import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { buildLoginHref } from "@/lib/safe-redirect";

// For actions that need an account: send guests to login and bring them back to this page.
export function useRequireAuth() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  const redirectToLogin = () => router.push(buildLoginHref(pathname));

  return {
    session,
    isLoading: status === "loading",
    isAuthenticated: status === "authenticated" && Boolean(session),
    redirectToLogin,
  };
}
