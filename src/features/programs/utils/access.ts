// Centralized access checks to avoid duplicating logic across UI components.

export const isFreeContent = (
  isFree?: number | null,
  isProgramIntro?: number | null,
): boolean => {
  return isFree === 1 || isProgramIntro === 1;
};

export const getVideoAccessState = (
  isFree?: number | null,
  isProgramIntro?: number | null,
) => ({
  isLocked: !isFreeContent(isFree, isProgramIntro),
});

// For cards where only price is available, treat paid programs as locked content.
export const getProgramAccessState = (price?: number | null) => ({
  isLocked: typeof price === "number" && price > 0,
});
