import { Suspense } from "react";
import PaymentSuccessPageView from "@/features/payment/pages/PaymentSuccessPageView";

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-muted animate-pulse" />}>
      <PaymentSuccessPageView />
    </Suspense>
  );
}
