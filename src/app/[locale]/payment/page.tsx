import { Suspense } from "react";
import PaymentPageView from "@/features/payment/pages/PaymentPageView";

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-muted animate-pulse" />}>
      <PaymentPageView />
    </Suspense>
  );
}
