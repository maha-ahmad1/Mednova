export interface WalletBalance {
  available_balance: number;
  pending_balance: number;
  frozen_balance: number;
  total_balance: number;
  currency: string;
  last_updated: string;
}
