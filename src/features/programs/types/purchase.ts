export type PurchaseStatus = "unpaid" | "paid" | "payment_suspended" | "expired";

export interface ProgramPurchase {
  id: number;
  program_id: number;
  status: PurchaseStatus;
  status_label: string;
  price: string;
  gateway_fee: string;
  // Confirmed by backend: populated from the moment the purchase is created
  // (e.g. "unpaid" with amount_paid: "20.180"), never null — same meaning as the
  // old amount_to_pay, just renamed. The earlier "maybe null before paid" caution
  // turned out to be wrong; kept this note so nothing re-adds an `| null` later.
  amount_paid: string;
  currency: string;
  is_enrolled: boolean;
}

export type ProgramCardType = "domestic";

export interface ProgramPaymentLinkPayload {
  payment_method: "card";
  card_type: ProgramCardType;
}

export interface ProgramPaymentLink {
  checkout_url: string;
  gateway_payment_id: number;
  biller_ref: string;
  expires_in_minutes: number;
}

export interface ProgramPurchaseResponse {
  success: boolean;
  message: string;
  data: ProgramPurchase;
  status: string;
}

export interface ProgramPaymentLinkResponse {
  success: boolean;
  message: string;
  data: ProgramPaymentLink;
  status: string;
}
