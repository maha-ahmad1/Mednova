export type WalletRole = "consultant" | "patient";

export type WalletSummary = {
  total_balance: number | string;
  available_balance: number | string;
  pending_balance?: number | string;
  frozen_balance?: number | string;
  withdrawable_balance?: number | string;
  pending_withdrawal?: number | string;
  currency: string;
  last_updated?: string;
};

export type WalletConsultationMeta = {
  id: number;
  type: "chat" | "video" | string;
  patient_name?: string;
  consultant_name?: string;
  consultation_price?: number | string;
};

export type WalletTransaction = {
  id: number;
  type: string;
  label: string;
  description?: string | null;
  amount: string;
  currency: string;
  status: string;
  status_label: string;
  note?: string | null;
  consultation?: WalletConsultationMeta | null;
  created_at: string;
};

export type WalletPayment = {
  id: number;
  consultation: WalletConsultationMeta | null;
  amount_paid: string;
  gateway_fee: string;
  payment_method: string;
  status: string;
  status_label: string;
  is_refunded: boolean;
  refunded_amount: string | null;
  refund_note: string | null;
  created_at: string;
};

export type PaginationMeta = {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
};

export type PaginatedResponse<T> = {
  data: T[];
  meta?: PaginationMeta;
  pagination?: PaginationMeta;
};
