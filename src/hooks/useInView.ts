"use client";

import { useEffect, useRef, useState } from "react";

interface UseInViewOptions {
  /** Fraction of the element that must be visible (0–1). */
  amount?: number;
  /** Margin around the viewport, e.g. "200px" to start slightly before entering. */
  rootMargin?: string;
}

/**
 * Tracks whether an element is in the viewport.
 * - `seen`: becomes true on first entry and stays true (for one-shot reveals).
 * - `visible`: live state (for pausing looping animations while off-screen).
 * With prefers-reduced-motion, `seen` is true from mount so content renders in its final state.
 */
export function useInView<T extends Element>({
  amount = 0.4,
  rootMargin = "0px",
}: UseInViewOptions = {}) {
  const ref = useRef<T | null>(null);
  const [seen, setSeen] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setSeen(true);
      return;
    }

    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setSeen(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting);
        if (entry.isIntersecting) setSeen(true);
      },
      { threshold: amount, rootMargin },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [amount, rootMargin]);

  return { ref, seen, visible };
}
