export type MeasurementStatus =
  | "pending"
  | "in_progress"
  | "completed"
  | "abandoned"
  | "cancelled";

export type AffectedSide = "left" | "right" | "both";

export interface Measurement {
  measurement_id: string; // e.g. "MEAS-4F7A2B1C" — never numeric, never the internal DB id
  exercise_type: string;
  affected_side: AffectedSide;
  target_rom: number;
  target_reps: number;
  duration_seconds: number;
  measured_rom: number | null;
  reps_completed: number | null;
  accuracy_percentage: number | null;
  status: MeasurementStatus;
  status_label: string; // already localized server-side, display as-is
  end_reason: string | null;
  therapist_url: string;
  patient_url: string;
  expires_at: string;
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
}

export interface RequestMeasurementPayload {
  exercise_type: string;
  affected_side: AffectedSide;
  target_rom: number;
  target_reps: number;
  duration_seconds: number;
}

// IMPORTANT: do NOT reuse `ApiEnvelope<T>` from `src/features/financial/types/index.ts`.
// That type declares `status: number`, but this API's envelope returns `status` as a
// human-readable string (e.g. "successfully created."). Define a local envelope instead:
export interface MeasurementApiEnvelope<T> {
  success: boolean;
  message: string; // sometimes a translation key like "NOT_FOUND", sometimes a full sentence — see resolveApiMessage.ts
  data: T;
  pagination: null; // not paginated on this endpoint
  status: string;
}

export interface FieldValidationError {
  [field: string]: string;
}

export interface MeasurementPaginationMeta {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
}

// Endpoint 5 (patient measurement history) is the only measurement endpoint
// that's actually paginated — its envelope carries a real `pagination`
// object, so it can't reuse `MeasurementApiEnvelope<T>` above (which pins
// `pagination: null` for the other four endpoints).
export interface PaginatedMeasurementEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
  pagination: MeasurementPaginationMeta;
  status: string;
}

// Pusher payload for the `.measurement.ended` event, fired on both
// `private-patient.{id}` and `private-consultant.{id}` — confirmed against
// real backend payloads. Supersedes the earlier `.measurement.completed` /
// `MeasurementCompletedPayload` guess: that event name never actually fires,
// `consultation_type` here is already the resolved "chat" | "video" (not a
// raw PHP FQCN), and the two channels carry different shapes.
export type MeasurementSessionStatus = "completed" | "cancelled" | "abandoned";

// Known values as of this writing — more may be added by the backend later
// (see mapMeasurementOutcome's fallback), so this is deliberately widened
// rather than narrowed to a closed union.
export type MeasurementEndReason =
  | "completed"
  | "cancelled_by_doctor"
  | "stopped_by_patient"
  | "pain"
  | "technical_error"
  | (string & {});

interface MeasurementEndedEventBase {
  measurement_id: string;
  consultation_id: number;
  consultation_type: "chat" | "video";
  status: MeasurementSessionStatus;
  end_reason: MeasurementEndReason;
  message: string; // raw backend copy — do not render directly, build our own per outcome
  exercise_type: string;
  affected_side: "left" | "right";
  completed_at: string;
  reps_completed: number | null; // confirmed null on cancelled_by_doctor
  target_reps: number;
}

// private-consultant.{id} only — adds clinical metrics not sent to the patient.
export interface MeasurementEndedEventConsultant extends MeasurementEndedEventBase {
  measured_rom: number;
  target_rom: number;
  accuracy_percentage: number;
  incorrect_movements: number;
  movement_smoothness: number;
  fatigue_estimation: number;
  recovery_score: number;
}

// private-patient.{id} only — lean, patient-safe, no clinical metrics.
export type MeasurementEndedEventPatient = MeasurementEndedEventBase;
