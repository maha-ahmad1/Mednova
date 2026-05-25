export type DisputeStatus = "opened" | "under_review" | "resolved";
export type DisputeResolution = "release" | "refund";

// ── List item (flat, from GET /disputes) ─────────────────────
export interface Dispute {
  id: number;
  status: DisputeStatus;
  status_label: string;
  resolution?: DisputeResolution;
  consultation_id: number;
  consultation_type: string;
  patient_name: string;
  consultant_name: string;
  amount: string;
  currency: string;
  opened_at: string;
  resolved_at?: string | null;
  hours_since_opened?: number;
  service_evidence_summary?: string | null;
}

// ── Detail response (nested, from GET /disputes/{id}) ────────
export interface DisputeDetailParty {
  id: number;
  full_name: string;
  email?: string | null;
  phone?: string | null;
}

export interface ChatEvidence {
  patient_message_count: number;
  consultant_message_count: number;
  total_messages: number;
  first_patient_message_at: string | null;
  first_consultant_message_at: string | null;
  consultant_responded: boolean;
  response_time_minutes: number | null;
}

export interface ServiceEvidence {
  chat: ChatEvidence | null;
  video: Record<string, unknown> | null;
}

export interface DisputeDetail {
  dispute: {
    id: number;
    status: DisputeStatus;
    status_label: string;
    resolution?: DisputeResolution;
    admin_note?: string | null;
    opened_at: string;
    resolved_at?: string | null;
    amount: string;
    currency: string;
  };
  consultation: {
    id: number;
    type: string;
  };
  patient: DisputeDetailParty;
  consultant: DisputeDetailParty;
  service_evidence: ServiceEvidence;
}

export interface DisputesSummary {
  total_frozen_amount: string;
  total_open: number;
  total_resolved: number;
}

export interface DisputesListData {
  data: Dispute[];
  summary: DisputesSummary;
}

export interface ResolveDisputePayload {
  resolution: DisputeResolution;
  admin_note: string;
}

export interface PaginationMeta {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}

export interface DisputesEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
  pagination: PaginationMeta | null;
}
