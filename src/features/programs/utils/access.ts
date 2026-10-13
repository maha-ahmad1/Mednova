// Centralized access checks to avoid duplicating logic across UI components.
// Lock decisions now come pre-computed from the backend (is_locked / is_enrolled).

export const getVideoAccessState = (isLocked?: boolean | null) => ({
  isLocked: Boolean(isLocked),
});
