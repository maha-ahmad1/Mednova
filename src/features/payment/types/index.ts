// ─────────────────────────────────────────────────────────────
// src/features/payment/types/index.ts
//
// Types for GET /api/consultation-request/{role}/{id}/{type}
// The response shape is the same regardless of the viewer role.
// ─────────────────────────────────────────────────────────────

// ── Financial status ─────────────────────────────────────────

/** All possible values for a consultation's financial_status field. */
export type FinancialStatus =
  | "unpaid"
  | "payment_suspended"
  | "held"
  | "review_window"
  | "withdrawable"
  | "withdrawn"
  | "frozen"
  | "refunded"
  | "refunded_internal";

/** Statuses where the patient still needs to pay. */
export const PAYMENT_PENDING_STATUSES = [
  "unpaid",
  "payment_suspended",
] as const satisfies readonly FinancialStatus[];

/** Statuses where payment has already been captured. */
export const PAID_STATUSES = [
  "held",
  "review_window",
  "withdrawable",
  "withdrawn",
  "frozen",
  "refunded",
  "refunded_internal",
] as const satisfies readonly FinancialStatus[];

export function isPaymentPending(status: FinancialStatus): boolean {
  return (PAYMENT_PENDING_STATUSES as readonly string[]).includes(status);
}

export function isPaid(status: FinancialStatus): boolean {
  return (PAID_STATUSES as readonly string[]).includes(status);
}

// ── Shared party shape ────────────────────────────────────────

/** A participant (patient or consultant) on a consultation. */
export interface ConsultationParty {
  id: number;
  image: string | null;
  full_name: string;
  email: string | null;
  phone: string | null;
  type_account: string | null;
  birth_date: string | null;
  gender: string | null;
  average_rating: number | null;
  total_reviews: number | null;
  is_completed: boolean;
  account_status: string | null;
  approval_status: string | null;
  timezone: string | null;
  email_verified_at: string | null;
  phone_verified_at: string | null;
  created_at: string | null;
}

// ── Appointment shape ─────────────────────────────────────────

/**
 * Scheduling details for a consultation.
 * `requested_day` is lowercase from the backend (e.g. "friday").
 * Capitalize at the UI layer if needed.
 */
export interface ConsultationAppointment {
  consultant_type: string;
  /** Backend returns lowercase day names (e.g. "friday"). Capitalize at the UI layer if needed. */
  requested_day: string;
  /** e.g. "2026-05-28 10:10" */
  requested_time: string;
  confirmed_end_time: string | null;
  /** e.g. "Asia/Hebron" */
  timezone: string;
  status: string;
  is_finished: 0 | 1;
  finished_at: string | null;
  /** e.g. "online" */
  type_appointment: string;
}

// ── Inner data shape ──────────────────────────────────────────

/** All business fields for a consultation — lives under ConsultationDetails.data. */
export interface ConsultationInnerData {
  id: number;
  patient: ConsultationParty;
  consultant: ConsultationParty;
  consultant_type: string;
  appointment: ConsultationAppointment;
  status: string;
  financial_status: FinancialStatus;
  review_deadline: string | null;
  released_at: string | null;
  consultant_approved: boolean | null;
  patient_approved: boolean | null;
  duration_minutes: number;
  video_room_link: string | null;
  session_duration_hours: number;
}

// ── Financial shape ───────────────────────────────────────────

/**
 * Patient-view financial fields. Backend returns this shape when called with a patient token.
 * Consultant-view shape (platform_commission_*, your_earning) is intentionally not modeled —
 * /payment is patient-only. If consultant view is added later, convert this to a discriminated
 * union or generic.
 */
export interface ConsultationFinancial {
  consultation_price: string;
  gateway_commission_rate: string;
  gateway_commission_amount: string;
  gross_amount: string;
}

// ── Outer wrapper ─────────────────────────────────────────────

/**
 * Shape returned by GET /api/consultation-request/{role}/{id}/{type}.
 *
 * Backend wraps business fields under a nested `data` property. The outer
 * object only carries id/type/financial/timestamps. All patient, consultant,
 * appointment, and status fields live inside `data`. This is a known backend
 * shape — do not flatten on frontend.
 */
export interface ConsultationDetails {
  id: number;
  type: "video" | "chat";
  /** All business fields live here — see ConsultationInnerData. */
  data: ConsultationInnerData;
  suspended_until: string | null;
  suspension_count: number;
  financial: ConsultationFinancial;
  created_at: string;
  updated_at: string;
}

// ── Response envelope ─────────────────────────────────────────

/** Matches the ApiEnvelope shape used across the project (no cross-feature import). */
type ApiEnvelope<T> = {
  success: boolean;
  message?: string;
  data: T;
  pagination?: unknown;
  status?: string;
};

/** Full API response for GET /api/consultation-request/{role}/{id}/{type}. */
export type ConsultationDetailsResponse = ApiEnvelope<ConsultationDetails>;
