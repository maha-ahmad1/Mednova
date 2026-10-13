import type { KawaderPriority, KawaderServiceKey, KawaderStatus } from "../types/kawader";

/** Earliest allowed preferred time, in hours from now. (Backend is still at 2h until the change ships.) */
export const MIN_HOURS_BEFORE = 4;

/** Latest allowed preferred time, in days from now. */
export const MAX_DAYS_AHEAD = 30;

/** All seven statuses, in lifecycle order (filter chips, validation of URL params). */
export const KAWADER_STATUSES: readonly KawaderStatus[] = [
  "pending",
  "sent_to_hospital",
  "confirmed",
  "completed",
  "rejected",
  "cancelled",
  "expired",
];

export const KAWADER_PRIORITIES: readonly KawaderPriority[] = ["urgent", "soon", "normal"];

export const KAWADER_SERVICE_KEYS: readonly KawaderServiceKey[] = [
  "gp_visit",
  "dietitian",
  "home_nursing",
  "physiotherapy",
  "home_diagnostics",
  "patient_transfer",
  "medical_supplies_delivery",
  // Old key of the seventh service; kept until the backend rename ships.
  "pharmacy_delivery",
];

/** Statuses that still count towards the patient's open-request limit. */
export const OPEN_STATUSES: readonly KawaderStatus[] = ["pending", "sent_to_hospital", "confirmed"];
