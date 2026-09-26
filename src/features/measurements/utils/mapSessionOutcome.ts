import type { MeasurementEndReason, MeasurementSessionStatus } from "../types";

// Real {status, end_reason} model confirmed against live backend payloads for
// the `.measurement.ended` event — replaces the earlier placeholder mapping,
// which assumed a `cancelled_by_patient` status that doesn't exist: every
// patient-initiated ending (stop / pain / connection loss) arrives as
// status "abandoned", never "cancelled" (that status is doctor-only).
export type MeasurementOutcomeSeverity = "success" | "info" | "warning" | "neutral";

export interface MeasurementOutcome {
  key: string; // stable key for i18n lookups, e.g. "completed", "pain", "unknown"
  severity: MeasurementOutcomeSeverity;
  needsElevatedAttention: boolean; // true only for "pain" — surface with warning styling
}

export const mapMeasurementOutcome = (
  status: MeasurementSessionStatus,
  endReason: MeasurementEndReason,
): MeasurementOutcome => {
  if (status === "completed" && endReason === "completed") {
    return { key: "completed", severity: "success", needsElevatedAttention: false };
  }
  if (status === "cancelled" && endReason === "cancelled_by_doctor") {
    return { key: "cancelled_by_doctor", severity: "neutral", needsElevatedAttention: false };
  }
  if (status === "abandoned" && endReason === "pain") {
    // Clinically relevant — patient reported pain during the exercise.
    return { key: "pain", severity: "warning", needsElevatedAttention: true };
  }
  if (status === "abandoned" && endReason === "stopped_by_patient") {
    return { key: "stopped_by_patient", severity: "info", needsElevatedAttention: false };
  }
  if (status === "abandoned" && endReason === "technical_error") {
    return { key: "technical_error", severity: "neutral", needsElevatedAttention: false };
  }

  // Defensive fallback for any future/unmapped combination — never throw, never
  // silently treat an unknown reason as "completed".
  console.warn("[measurement] Unmapped status/end_reason combination", { status, endReason });
  return { key: "unknown", severity: "neutral", needsElevatedAttention: false };
};
