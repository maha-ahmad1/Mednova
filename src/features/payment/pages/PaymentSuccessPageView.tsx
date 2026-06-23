"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/shared/ui/components/Navbar/Navbar";
import { useFetcher } from "@/hooks/useFetcher";
import { usePaymentStatus } from "@/features/payment/hooks/usePaymentStatus";
import {
  type ConsultationDetails,
  type PaymentStatusType,
  isPaid as isPaidStatus,
} from "@/features/payment/types";
import { PaymentSuccessScreen } from "@/features/payment/ui/PaymentSuccessScreen";
import { PaymentStatusBanner } from "@/features/payment/ui/PaymentStatusBanner";

export default function PaymentSuccessPageView() {
  const router = useRouter();
  const t = useTranslations("payment");
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const consultationId = searchParams.get("consultation_id");
  const type = searchParams.get("type") as "video" | "chat" | null;

  const queryKey = ["consultation", "payment-success", consultationId, type];

  const endpoint =
    consultationId && type
      ? `/api/consultation-request/consultant/${consultationId}/${type}`
      : null;

  const {
    data: details,
    isLoading,
    error,
  } = useFetcher<ConsultationDetails>(queryKey, endpoint);

  const { data: paymentStatusData, isLoading: isCheckingStatus } =
    usePaymentStatus({
      consultationId: details?.id,
      enabled: Boolean(details?.id),
    });

  // When polling confirms payment, invalidate the details query so the
  // financial_status refreshes and the success screen can render.
  useEffect(() => {
    if (paymentStatusData?.status === "paid") {
      queryClient.invalidateQueries({ queryKey });
    }
    // queryKey is stable for a given consultationId+type; listing it would
    // cause re-runs on every render without changing behaviour.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paymentStatusData?.status, queryClient]);

  useEffect(() => {
    if (!consultationId || !type) {
      toast.error(t("invalidLink"));
      router.replace("/");
    }
  }, [consultationId, type, router, t]);

  if (!consultationId || !type) return null;

  // ── Loading ──────────────────────────────────────────────────
  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="flex min-h-screen items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </>
    );
  }

  // ── Network error ────────────────────────────────────────────
  if (error) {
    return (
      <>
        <Navbar />
        <div className="flex min-h-screen items-center justify-center px-4">
          <Card className="w-full max-w-sm overflow-hidden border-0 shadow-xl">
            <CardContent className="space-y-4 p-6 text-center">
              <X className="mx-auto h-12 w-12 text-rose-500" />
              <p className="font-semibold">{t("loadError")}</p>
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
                className="w-full"
              >
                {t("retry")}
              </Button>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  // ── Not found ────────────────────────────────────────────────
  if (!details) {
    return (
      <>
        <Navbar />
        <div className="flex min-h-screen items-center justify-center px-4">
          <Card className="w-full max-w-sm overflow-hidden border-0 shadow-xl">
            <CardContent className="p-6 text-center">
              <p className="font-semibold">{t("notFound")}</p>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  // ── Payment confirmed → success screen ──────────────────────
  if (isPaidStatus(details.data.financial_status)) {
    return (
      <>
        <Navbar />
        <PaymentSuccessScreen
          consultationId={details.id}
          consultationType={details.type}
          details={details}
        />
      </>
    );
  }

  // ── Polling for backend confirmation ─────────────────────────
  const rawStatus = paymentStatusData?.status ?? "pending";
  const bannerStatus: PaymentStatusType = isCheckingStatus
    ? "loading"
    : (rawStatus as PaymentStatusType);

  return (
    <>
      <Navbar />
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-md">
          <PaymentStatusBanner status={bannerStatus} />
        </div>
      </div>
    </>
  );
}
