/**
 * Routes that require a fully-approved account (completed profile + approval_status "approved").
 * Users who are incomplete, pending review, or rejected are redirected away from these routes
 * to their respective status page. All other routes (home, specialists, services, articles,
 * etc.) stay freely browsable so users can explore the platform while waiting.
 */
export const APPROVED_ACCOUNT_RESTRICTED_ROUTES = [
  "/appointment",
  "/payment",
  "/profile",
  "/profile/chat",
  "/profile/consultations",
  "/profile/financial",
];

/** Returns true if the given clean path (no locale prefix) requires an approved account. */
export function isRestrictedForUnapprovedAccount(cleanPath: string): boolean {
  return APPROVED_ACCOUNT_RESTRICTED_ROUTES.some(
    (route) => cleanPath === route || cleanPath.startsWith(`${route}/`),
  );
}
