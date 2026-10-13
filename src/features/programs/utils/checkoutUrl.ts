// Guards against an open-redirect if the payment-link response ever contains a
// tampered or unexpected host — never navigate to a checkout_url without checking
// it first. This same gap exists in the consultations payment flow
// (PaymentPageView.tsx's handleStartPayment navigates to checkout_url with no host
// check at all), so this is a fresh implementation, not a copy of an existing one.
//
// The allowlist comes from NEXT_PUBLIC_PAYMENT_HOSTS (comma-separated, matched
// against url.host so the port is included, e.g. "test.amwalpg.com:7443").
// Falls back to the production gateway when the variable is unset.
const DEFAULT_CHECKOUT_HOSTS = ["secure.amwalpay.com"];

const getAllowedHosts = (): string[] => {
  const fromEnv = (process.env.NEXT_PUBLIC_PAYMENT_HOSTS ?? "")
    .split(",")
    .map((host) => host.trim())
    .filter(Boolean);
  return fromEnv.length > 0 ? fromEnv : DEFAULT_CHECKOUT_HOSTS;
};

export const isAllowedCheckoutUrl = (checkoutUrl: string): boolean => {
  try {
    const url = new URL(checkoutUrl);
    return url.protocol === "https:" && getAllowedHosts().includes(url.host);
  } catch {
    return false;
  }
};
