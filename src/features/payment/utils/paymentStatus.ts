export type PaymentStatus = "paid" | "failed" | "pending";

const toText = (value: unknown): string =>
  typeof value === "string" ? value.trim().toLowerCase() : "";

export const normalizePaymentStatus = (value: unknown): PaymentStatus => {
  const status = toText(value);

  if (["paid", "completed", "success", "succeeded", "successful"].includes(status)) {
    return "paid";
  }

  if (["failed", "declined", "cancelled", "canceled", "error"].includes(status)) {
    return "failed";
  }

  return "pending";
};

export const extractPaymentStatus = (consultation: unknown): PaymentStatus => {
  if (!consultation || typeof consultation !== "object") {
    return "pending";
  }

  const record = consultation as Record<string, unknown>;
  const directCandidates = [
    record.payment_status,
    record.status_payment,
    record.gateway_payment_status,
    (record.payment as Record<string, unknown> | undefined)?.status,
    (record.data as Record<string, unknown> | undefined)?.payment_status,
  ];

  for (const candidate of directCandidates) {
    const normalized = normalizePaymentStatus(candidate);
    if (normalized !== "pending") {
      return normalized;
    }
  }

  return "pending";
};
