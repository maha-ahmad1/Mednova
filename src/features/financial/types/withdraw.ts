export interface BankAccount {
  id: number;
  bank_name: string;
  account_holder_name: string;
  account_number: string;
  iban: string;
  swift_code: string;
  bank_country: string;
  status: "pending" | "verified";
  is_verified: boolean;
}

export interface AddBankAccountPayload {
  bank_name: string;
  account_holder_name: string;
  account_number: string;
  iban: string;
  swift_code: string;
  bank_country: "OM";
}

export interface VerifyOtpPayload {
  otp: string;
}

export type WithdrawalStatus = "pending" | "completed" | "cancelled";

export interface Withdrawal {
  id: number;
  amount: number;
  currency: string;
  status: WithdrawalStatus;
  status_label: string;
  bank_account: { bank_name: string; iban: string };
  created_at: string;
}

export interface GetWithdrawalsParams {
  page?: number;
  per_page?: number;
  status?: WithdrawalStatus | "all";
}
