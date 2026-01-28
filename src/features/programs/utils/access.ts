// Centralized access checks to avoid duplicating is_free logic across UI components.
export const isFreeContent = (isFree?: number | null): boolean => isFree === 1

export const getVideoAccessState = (isFree?: number | null) => ({
  isLocked: !isFreeContent(isFree),
})

// For cards where only price is available, treat paid programs as locked content.
export const getProgramAccessState = (price?: number | null) => ({
  isLocked: typeof price === "number" && price > 0,
})
