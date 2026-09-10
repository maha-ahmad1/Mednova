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

// Pusher payload for the `.measurement.completed` event on the consultant's
// private channel. Deliberately NOT the same shape as `Measurement` — this
// push carries no `status_label`, `therapist_url`, or `patient_url`; those
// only come back from the REST refetch triggered on receipt.
export interface MeasurementCompletedPayload {
  consultation_id: number;
  consultation_type: string; // raw PHP FQCN, e.g. "App\\Models\\ConsultationVideoRequest"
  measurement_id: string;
  status: "completed" | "abandoned" | "cancelled";
  exercise_type: string;
  affected_side: AffectedSide;
  measured_rom: number | null;
  target_rom: number;
  reps_completed: number | null;
  target_reps: number;
  accuracy_percentage: number | null;
  end_reason: string;
  completed_at: string;
}
