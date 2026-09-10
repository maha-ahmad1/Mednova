import type { MeasurementStatus } from "../types";

// Extracted unchanged from MeasurementResultCard (Phase 3) so every
// measurement UI (result card, history table, ...) shares one status
// badge-color mapping instead of redefining it. Colors reuse the closest
// existing status-color conventions from consultation-helpers.tsx: red for
// cancelled (same as cancelled consultations), amber for abandoned (same
// muted/warning tone Phase 2 already reused for "pending"), and the app's
// established teal/10 treatment for a completed/success tone. Statuses not
// listed here (pending, in_progress) fall back to the neutral gray badge.
const MEASUREMENT_STATUS_BADGE_CLASS: Partial<Record<MeasurementStatus, string>> = {
  completed: "bg-[#32A88D]/10 text-[#32A88D] border-[#32A88D]/20",
  cancelled: "bg-red-100 text-red-800 border-red-200",
  abandoned: "bg-amber-100 text-amber-800 border-amber-200",
};

export const MEASUREMENT_STATUS_BADGE_FALLBACK_CLASS =
  "bg-gray-100 text-gray-800 border-gray-200";

export function getMeasurementStatusBadgeClass(status: MeasurementStatus): string {
  return MEASUREMENT_STATUS_BADGE_CLASS[status] ?? MEASUREMENT_STATUS_BADGE_FALLBACK_CLASS;
}
