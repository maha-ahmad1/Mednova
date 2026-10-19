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

/** Event name as set by the backend's `broadcastAs` (no PHP class namespace). */
export const KAWADER_REALTIME_EVENT = "kawader.request.status.changed";

/** Echo needs the leading dot for `broadcastAs` names, otherwise it prefixes the app namespace. */
export const KAWADER_ECHO_EVENT = `.${KAWADER_REALTIME_EVENT}`;

/** Private channel the admins listen on (Pusher name: `private-admin.notifications`). */
export const KAWADER_ADMIN_CHANNEL = "admin.notifications";

/** Every Kawader notification `type` (stored = broadcast `event_type`) starts with this. */
export const KAWADER_NOTIFICATION_PREFIX = "kawader_";

/** Statuses that still count towards the patient's open-request limit. */
export const OPEN_STATUSES: readonly KawaderStatus[] = ["pending", "sent_to_hospital", "confirmed"];
