/**
 * Routes that require a fully-completed profile.
 * Incomplete users who try to access these are redirected to /profile/create.
 * All other authenticated routes are freely accessible (with a banner reminder).
 */
export const INCOMPLETE_PROFILE_RESTRICTED_ROUTES = [
  "/appointment",
  "/payment",
  "/profile",
  "/profile/chat",
  "/profile/consultations",
  "/profile/financial",
];

/** Returns true if the given clean path (no locale prefix) is restricted for incomplete profiles. */
export function isRestrictedForIncompleteProfile(cleanPath: string): boolean {
  return INCOMPLETE_PROFILE_RESTRICTED_ROUTES.some(
    (route) => cleanPath === route || cleanPath.startsWith(`${route}/`),
  );
}
