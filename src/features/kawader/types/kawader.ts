// ---------------------------------------------------------------------------
// Envelope
// ---------------------------------------------------------------------------

export interface KawaderPagination {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
  has_more_pages: boolean;
}

export interface KawaderEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
  /** Only set on lists; sits next to `data` (which is the plain array). */
  pagination: KawaderPagination | null;
  status: string;
}

export type KawaderListEnvelope<T> = KawaderEnvelope<T[]>;

// ---------------------------------------------------------------------------
// Enums
// ---------------------------------------------------------------------------

export type KawaderStatus =
  | "pending"
  | "sent_to_hospital"
  | "confirmed"
  | "completed"
  | "rejected"
  | "cancelled"
  | "expired";

export type KawaderPriority = "urgent" | "soon" | "normal";

/**
 * Body of the `kawader.request.status.changed` broadcast. `event_type` and `message`
 * are not in the API doc, so both are optional; `message` is a fixed-language string
 * and is never shown to the user.
 */
export interface KawaderRealtimePayload {
  kawader_request_id: number;
  reference_code: string;
  status: KawaderStatus;
  event_type?: string;
  message?: string;
}

export type KawaderServiceKey =
  | "gp_visit"
  | "dietitian"
  | "home_nursing"
  | "physiotherapy"
  | "home_diagnostics"
  | "patient_transfer"
  | "medical_supplies_delivery"
  // Old key of the seventh service; accepted until the backend rename ships.
  | "pharmacy_delivery";

/** Statuses the admin can move a request to (A3). */
export type KawaderTargetStatus = Exclude<KawaderStatus, "pending" | "expired">;

// ---------------------------------------------------------------------------
// Services (P1)
// ---------------------------------------------------------------------------

export interface KawaderService {
  key: KawaderServiceKey;
  name: string;
  hint: string | null;
  needs_details: boolean;
  needs_destination: boolean;
}

export interface KawaderArea {
  key: string;
  name: string;
}

export interface KawaderServicesResponse {
  services: KawaderService[];
  /** Not shipped yet — render the area field only when present. */
  areas?: KawaderArea[];
  /** Not shipped yet — treat a missing value as `false`. */
  insurance_enabled?: boolean;
  emergency_phone: string | null;
}

// ---------------------------------------------------------------------------
// Patient request (P2–P5)
// ---------------------------------------------------------------------------

interface KawaderServiceRef {
  key: KawaderServiceKey;
  name: string;
}

interface KawaderAreaRef {
  key: string;
  name: string;
}

export interface KawaderRequest {
  id: number;
  reference_code: string;
  status: KawaderStatus;
  status_label: string;
  service: KawaderServiceRef;
  /** Not shipped yet. */
  service_area?: KawaderAreaRef | null;
  patient_name: string;
  patient_age: number;
  patient_phone: string;
  location_address: string;
  latitude: number | null;
  longitude: number | null;
  transfer_destination: string | null;
  /** UTC ISO 8601. */
  preferred_at: string;
  has_insurance: boolean;
  insurance_company: string | null;
  insurance_card_masked: string | null;
  patient_notes: string | null;
  /** Rejection / cancellation reason; shown to the patient. */
  status_reason: string | null;
  can_cancel: boolean;
  created_at: string;
}

// ---------------------------------------------------------------------------
// Admin (A1–A3)
// ---------------------------------------------------------------------------

export interface AdminKawaderListItem {
  id: number;
  reference_code: string;
  status: KawaderStatus;
  status_label: string;
  /** `null` for closed requests. */
  priority: KawaderPriority | null;
  priority_label: string | null;
  service: KawaderServiceRef;
  service_area?: KawaderAreaRef | null;
  patient_name: string;
  patient_age: number;
  patient_phone: string;
  preferred_at: string;
  has_insurance: boolean;
  created_at: string;
}

export interface KawaderStatusLog {
  from_status: KawaderStatus | null;
  to_status: KawaderStatus;
  /** "patient" | "admin" | "system" — kept open as the backend may add more. */
  actor_type: string;
  actor_name: string | null;
  note: string | null;
  created_at: string;
}

interface KawaderAccount {
  id: number;
  full_name: string;
  phone: string | null;
  email: string | null;
}

export interface KawaderHospitalMessage {
  text: string;
  whatsapp_url: string | null;
}

export interface AdminKawaderDetails {
  id: number;
  reference_code: string;
  status: KawaderStatus;
  status_label: string;
  priority: KawaderPriority | null;
  priority_label: string | null;
  service: KawaderServiceRef;
  service_area?: KawaderAreaRef | null;
  patient_name: string;
  patient_age: number;
  patient_phone: string;
  location_address: string;
  latitude: number | null;
  longitude: number | null;
  transfer_destination: string | null;
  preferred_at: string;
  has_insurance: boolean;
  insurance_company: string | null;
  /** Unmasked, admin only. */
  insurance_card_number: string | null;
  patient_notes: string | null;
  /** Who cancelled it ("patient" | "admin" | ...), `null` if not cancelled. */
  cancelled_by: string | null;
  status_reason: string | null;
  /** Internal note, never shown to the patient. */
  admin_note: string | null;
  handled_by_admin_id: number | null;
  consent_accepted_at: string | null;
  sent_to_hospital_at: string | null;
  confirmed_at: string | null;
  completed_at: string | null;
  rejected_at: string | null;
  cancelled_at: string | null;
  expired_at: string | null;
  created_at: string;
  updated_at: string;
  /** The account owner; may differ from `patient_name`. */
  account: KawaderAccount;
  allowed_transitions: KawaderTargetStatus[];
  hospital_message: KawaderHospitalMessage;
  status_logs: KawaderStatusLog[];
}

// ---------------------------------------------------------------------------
// Payloads
// ---------------------------------------------------------------------------

export interface CreateKawaderRequestPayload {
  service_key: KawaderServiceKey;
  /** Required once the backend ships areas. */
  service_area?: string;
  patient_name: string;
  patient_age: number;
  patient_phone: string;
  location_address: string;
  /** Send both or neither. */
  latitude?: number;
  longitude?: number;
  /** Only for services with `needs_destination`. */
  transfer_destination?: string;
  /** "YYYY-MM-DD HH:mm" in the patient's local time. */
  preferred_at: string;
  /** IANA name, e.g. "Asia/Muscat". */
  timezone: string;
  patient_notes?: string;
  /**
   * Insurance fields: the form sends them only when `insurance_enabled` is true
   * in the services response; while it is false they must be omitted.
   */
  has_insurance?: boolean;
  insurance_company?: string;
  insurance_card_number?: string;
  consent: true;
}

export interface CancelKawaderRequestPayload {
  reason?: string;
}

export type ChangeKawaderStatusPayload =
  | {
      status: Extract<KawaderTargetStatus, "sent_to_hospital" | "confirmed" | "completed">;
      admin_note?: string;
    }
  | {
      status: Extract<KawaderTargetStatus, "rejected" | "cancelled">;
      reason: string;
      admin_note?: string;
    };

// ---------------------------------------------------------------------------
// Filters
// ---------------------------------------------------------------------------

export interface MyKawaderRequestsFilters {
  status?: KawaderStatus;
  page?: number;
  per_page?: number;
}

export type AdminKawaderScope = "open" | "closed" | "all";

export interface AdminKawaderFilters {
  scope?: AdminKawaderScope;
  /** Overrides `scope`. */
  status?: KawaderStatus;
  priority?: KawaderPriority;
  service_key?: KawaderServiceKey;
  service_area?: string;
  /** Sent as 1 / 0. */
  has_insurance?: boolean;
  /** "YYYY-MM-DD", Oman days. */
  date_from?: string;
  date_to?: string;
  search?: string;
  page?: number;
  per_page?: number;
}
