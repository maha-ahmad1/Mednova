export type Currency = string;

export type TransactionType =
  | "consultation_credit"
  | "dispute_freeze"
  | "dispute_release"
  | "withdrawal"
  | "refund";

export type TransactionStatus = "available" | "frozen" | "completed" | "pending";

export type PaymentStatus = "captured" | "failed" | "pending" | "refunded";

export interface PaginationMeta {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}

export interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
  pagination: PaginationMeta | null;
  status: number;
}

export interface ConsultantWallet {
  total_balance: number;
  available_balance: number;
  pending_balance: number;
  frozen_balance: number;
  withdrawable_balance: number;
  currency: Currency;
}

export interface PatientWallet {
  total_balance: number;
  available_balance: number;
  pending_withdrawal: number;
  withdrawable_balance: number;
  currency: Currency;
}

export type TransactionConsultation = {
  id: number;
  type: "chat" | "video";
  patient_name?: string;
  consultant_name?: string;
} | null;

export interface Transaction {
  id: number;
  type: TransactionType;
  label: string;
  description?: string;
  amount: number;
  currency: Currency;
  status: TransactionStatus;
  status_label: string;
  note?: string;
  consultation: TransactionConsultation;
  created_at: string;
}

export interface PatientPayment {
  id: number;
  consultation: {
    id: number;
    type: "chat" | "video";
    consultant_name: string;
    consultation_price: number;
  };
  amount_paid: number;
  gateway_fee: number;
  payment_method: string;
  status: PaymentStatus;
  status_label: string;
  is_refunded: boolean;
  refunded_amount: number;
  refund_note: string;
  created_at: string;
}
