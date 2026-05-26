import type { ApiEnvelope, PaginationMeta } from "@/features/financial/types";

export type { ApiEnvelope, PaginationMeta };

// ─── Dashboard ────────────────────────────────────────────────────────────────

export interface AdminDashboardWallet {
  available_balance: string;
  pending_balance: string;
  frozen_balance: string;
  total_balance: string;
  currency: string;
}

export interface AdminDashboardConsultations {
  total_paid: number;
  total_settled: number;
  total_held: number;
  total_in_review: number;
  total_in_dispute: number;
  total_refunded: number;
}

export interface AdminDashboardRevenue {
  this_month: string;
  last_month: string;
  currency: string;
}

export interface AdminDashboardDisputes {
  pending_count: number;
  avg_resolution_hours: number;
}

export interface AdminDashboard {
  wallet: AdminDashboardWallet;
  consultations: AdminDashboardConsultations;
  revenue: AdminDashboardRevenue;
  disputes: AdminDashboardDisputes;
}

// ─── Revenue ──────────────────────────────────────────────────────────────────

export interface RevenueConsultation {
  id: number;
  type: "video" | "chat";
  patient_name: string;
  consultant_name: string;
}

export interface RevenueItem {
  id: number;
  consultation: RevenueConsultation | null;
  consultation_price: string;
  platform_commission_rate: string;
  platform_commission_amount: string;
  consultant_earning_amount: string;
  created_at: string;
}

export interface RevenueSummary {
  total_revenue: string;
  total_count: number;
  currency: string;
}

/** Shape of envelope.data for the revenue endpoint */
export interface RevenueData {
  data: RevenueItem[];
  summary: RevenueSummary;
}

// ─── Escrow ───────────────────────────────────────────────────────────────────

export type EscrowStatusFilter = "held" | "review_window" | "all";
export type EscrowFinancialStatus = "held" | "review_window";

export interface EscrowItem {
  consultation_id: number;
  type: "video" | "chat";
  patient_name: string;
  consultant_name: string;
  amount: string;
  financial_status: EscrowFinancialStatus;
  status_label: string;
  review_deadline: string | null;
  time_remaining: string | null;
  paid_at: string;
  currency: string;
}

export interface EscrowSummary {
  count_held: number;
  count_review: number;
  total_held_amount: string;
  total_review_amount: string;
  total_escrow: string;
  currency: string;
}

/** Shape of envelope.data for the escrow endpoint */
export interface EscrowData {
  data: EscrowItem[];
  summary: EscrowSummary;
}

// ─── Transactions ─────────────────────────────────────────────────────────────

export type AdminTransactionType =
  | "payment_record"
  | "consultation_hold"
  | "consultation_credit"
  | "platform_fee"
  | "refund"
  | "dispute_freeze"
  | "dispute_release"
  | "withdrawal";

export type EntryType = "credit" | "debit";

export interface TransactionConsultation {
  id: number;
  type: "video" | "chat";
  patient_name: string;
  consultant_name: string;
}

export interface TransactionMeta {
  role?: string;
  consultation_id?: number;
  consultant_id?: number;
  patient_id?: number;
  platform_commission_rate?: number;
  platform_commission_amount?: number;
  consultant_earning_amount?: number;
  [key: string]: unknown;
}

export interface AdminTransaction {
  id: number;
  type: AdminTransactionType;
  label: string;
  entry_type: EntryType;
  /** Includes "+" or "−" prefix, e.g. "+333.000" */
  amount: string;
  currency: string;
  status: string;
  consultation: TransactionConsultation | null;
  meta: TransactionMeta;
  created_at: string;
}

/** Extended pagination that includes has_more_pages from the backend */
export interface AdminPaginationMeta extends PaginationMeta {
  has_more_pages?: boolean;
}

/** Response shape for the transactions endpoint (array at top level) */
export interface AdminTransactionsResponse {
  success: boolean;
  data: AdminTransaction[];
  pagination: AdminPaginationMeta;
}

// ─── Withdrawals ──────────────────────────────────────────────────────────────

export type AdminWithdrawalStatus = "pending_review" | "approved" | "rejected";
export type AdminWithdrawalStatusFilter = AdminWithdrawalStatus | "all";
export type AdminProcessWithdrawalAction = "approve" | "reject";

/** Shape of each row in the withdrawals list */
export interface AdminWithdrawalListItem {
  id: string;
  amount: string;
  currency: string;
  status: AdminWithdrawalStatus;
  status_label: string;
  user_name: string;
  user_type: string;
  bank_name: string | null;
  has_transfer_proof: boolean;
  created_at: string;
}

export interface AdminWithdrawalUser {
  id: string;
  full_name: string;
  type: string;
  email: string;
  phone: string;
}

export interface AdminWithdrawalBankAccount {
  bank_name: string;
  account_holder_name: string;
  account_number: string;
  iban: string;
  swift_code: string | null;
  bank_country: string;
  status: string;
}

export interface AdminWithdrawalWalletSnapshot {
  available_balance: string;
  pending_balance: string;
  total_balance: string;
}

export interface AdminWithdrawalDetail {
  withdrawal: {
    id: string;
    amount: string;
    currency: string;
    status: string;
    status_label: string;
    admin_note: string | null;
    transfer_reference: string | null;
    has_transfer_proof: boolean;
    transfer_proof_url: string | null;
    created_at: string;
    processed_at: string | null;
  };
  user: AdminWithdrawalUser;
  bank_account: AdminWithdrawalBankAccount | null;
  wallet_snapshot: AdminWithdrawalWalletSnapshot | null;
}

/** Response shape for GET /withdrawals (list) */
export interface AdminWithdrawalsResponse {
  success: boolean;
  message: string;
  data: {
    data: AdminWithdrawalListItem[];
  };
  pagination: AdminPaginationMeta;
  status: string;
}

/** Response shape for GET /withdrawals/{id} (detail) */
export interface AdminWithdrawalDetailResponse {
  success: boolean;
  message: string;
  data: AdminWithdrawalDetail;
  status: string;
}

/** Payload sent to POST /withdrawals/{id}/process (assembled into FormData in the API layer) */
export interface AdminProcessWithdrawalPayload {
  action: AdminProcessWithdrawalAction;
  admin_note?: string | null;
  transfer_reference?: string | null;
  transfer_proof?: File | null;
}
