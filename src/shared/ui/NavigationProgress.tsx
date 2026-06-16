"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useNavigationStore } from "@/store/navigationStore";

/**
 * Thin progress bar fixed to the top of the viewport that appears whenever
 * programmatic navigation is in flight (triggered via useNavigationLoader).
 *
 * Mount once in the root layout — it has no visible output when idle.
 * Uses next/navigation's usePathname (not next-intl) so it works outside
 * the NextIntlClientProvider boundary.
 */
export function NavigationProgress() {
  const { isNavigating, setNavigating } = useNavigationStore();
  const pathname = usePathname();

  // Route rendered — clear the bar
  useEffect(() => {
    setNavigating(false);
  }, [pathname, setNavigating]);

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
