export type SessionOutcome =
  | "success"
  | "expired"
  | "cancelled_by_doctor"
  | "cancelled_by_patient"
  | "unknown";

// Raw values below reuse the `end_reason` strings already confirmed and shipped
// elsewhere in this feature (see bucketEndReason.ts and the
// `measurements.endReasons.*` translations) rather than the "expired" /
// "cancelled_by_patient" placeholders first guessed for this outcome set —
// the backend's actual field sends "timeout" and "stopped_by_patient".
// `stopped_by_therapist`, `pain`, `disconnected`, and `technical_error` are
// real, known end_reason values too, but this outcome set has no dedicated
// state for them yet, so they intentionally fall through to "unknown" below.
// Update this object (only this object) once the backend confirms otherwise.
const RAW_STATUS_MAP: Record<string, SessionOutcome> = {
  completed: "success",
  timeout: "expired",
  cancelled_by_doctor: "cancelled_by_doctor",
  stopped_by_patient: "cancelled_by_patient",
};

export function mapSessionOutcome(rawStatus: string | null | undefined): SessionOutcome {
  if (!rawStatus) return "unknown";
  const mapped = RAW_STATUS_MAP[rawStatus];
  if (!mapped) {
    // An unmapped value showed up — surface it instead of silently falling
    // back, so new/changed backend end_reason values get noticed.
    // No shared Sentry capture helper exists in this codebase yet; console.warn
    // is the agreed stopgap until one is added.
    console.warn(`Unmapped session end_reason received: ${rawStatus}`);
    return "unknown";
  }
  return mapped;
}
