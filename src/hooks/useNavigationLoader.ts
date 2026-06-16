"use client";

import { useCallback, useEffect } from "react";
import { useRouter, usePathname } from "@/i18n/navigation";
import { useNavigationStore } from "@/store/navigationStore";

/**
 * Locale-aware router wrapper that tracks navigation state globally.
 *
 * Drop-in replacement for useRouter() wherever router.push/replace is called
 * from a button or mutation callback. Sets isNavigating=true immediately on
 * navigation start so the NavigationProgress bar (mounted in root layout)
 * appears without any extra wiring.
 *
 * Usage:
 *   const { push, isNavigating } = useNavigationLoader();
 *   // Use push() exactly like router.push()
 *   // isNavigating is true from the push call until the new route renders
 */
export function useNavigationLoader() {
  const router = useRouter();
  const pathname = usePathname();
  const { isNavigating, setNavigating } = useNavigationStore();

  // Route rendered — navigation is complete
  useEffect(() => {
    setNavigating(false);
  }, [pathname, setNavigating]);

  // Safety valve: clear stuck state after 10s
  useEffect(() => {
    if (!isNavigating) return;
    const timeout = setTimeout(() => setNavigating(false), 10_000);
    return () => clearTimeout(timeout);
  }, [isNavigating, setNavigating]);

  const push = useCallback(
    (...args: Parameters<typeof router.push>) => {
      setNavigating(true);
      router.push(...args);
    },
    [router, setNavigating],
  );

  const replace = useCallback(
    (...args: Parameters<typeof router.replace>) => {
      setNavigating(true);
      router.replace(...args);
    },
    [router, setNavigating],
  );

  const back = useCallback(() => {
    setNavigating(true);
    router.back();
  }, [router, setNavigating]);

  return {
    isNavigating,
    push,
    replace,
    back,
    forward: () => router.forward(),
    refresh: () => router.refresh(),
    prefetch: (...args: Parameters<typeof router.prefetch>) =>
      router.prefetch(...args),
  };
}
