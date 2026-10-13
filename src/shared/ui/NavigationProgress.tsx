"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useNavigationStore } from "@/store/navigationStore";

/**
 * Thin progress bar fixed to the top of the viewport that appears on any
 * same-site navigation — both programmatic (via useNavigationLoader) and a
 * plain <Link>/<a> click, caught here via a capture-phase click listener so
 * every route transition in the app gets the same top-loader feedback
 * without every feature having to opt in individually.
 *
 * Mount once in the root layout — it has no visible output when idle.
 * Uses next/navigation's usePathname (not next-intl) so it works outside
 * the NextIntlClientProvider boundary. Deliberately does not also read
 * useSearchParams — that requires its own Suspense boundary, and pathname
 * alone is enough to clear the bar for the page transitions this targets.
 */
export function NavigationProgress() {
  const { isNavigating, setNavigating } = useNavigationStore();
  const pathname = usePathname();

  // Route rendered — clear the bar
  useEffect(() => {
    setNavigating(false);
  }, [pathname, setNavigating]);

  // Catch plain <Link>/<a> clicks too, not just useNavigationLoader's push() —
  // that hook is only used from a handful of places (e.g. dropdown row actions
  // that can't be real anchors); everywhere else navigates via a real <Link>,
  // which this listener picks up instead.
  //
  // Registered on the CAPTURE phase (the `true` below), not bubble — several
  // components in this app call event.stopPropagation() on link clicks
  // (e.g. MobileMenu.tsx's nav links), which would otherwise stop the event
  // from ever reaching a bubble-phase document listener and silently make
  // the bar "not appear" on just those navigations.
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const anchor = (event.target as HTMLElement | null)?.closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#")) return;
      if (anchor.target && anchor.target !== "_self") return;
      if (anchor.hasAttribute("download")) return;

      let url: URL;
      try {
        url = new URL(href, window.location.href);
      } catch {
        return;
      }

      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname && url.search === window.location.search) {
        return;
      }

      setNavigating(true);
    };

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, [setNavigating]);

  // Safety valve: clear a stuck bar if the pathname never ends up changing
  // (e.g. a navigation that gets cancelled or redirected client-side).
  useEffect(() => {
    if (!isNavigating) return;
    const timeout = setTimeout(() => setNavigating(false), 10_000);
    return () => clearTimeout(timeout);
  }, [isNavigating, setNavigating]);

  if (!isNavigating) return null;

  return (
    <div
      role="progressbar"
      aria-label="Page loading"
      className="fixed top-0 left-0 right-0 z-[9999] h-[3px] pointer-events-none"
    >
      <div className="h-full bg-primary nav-progress-bar" />
    </div>
  );
}
