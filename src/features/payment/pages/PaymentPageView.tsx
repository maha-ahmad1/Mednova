"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useRouter } from "@/i18n/navigation";
import { Clock, Loader2, MessageCircle, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/shared/ui/components/Navbar/Navbar";
import BreadcrumbNav from "@/shared/ui/components/BreadcrumbNav";
import { useCreatePaymentLink } from "@/features/payment/hooks/useCreatePaymentLink";
import { useFetcher } from "@/hooks/useFetcher";
import {
  type ConsultationDetails,
  isPaid as isPaidStatus,
  isPatientFinancial,
} from "@/features/payment/types";
import { PaymentForm } from "@/features/payment/ui/PaymentForm";

export default function PaymentPageView() {
  const router = useRouter();
  const t = useTranslations("payment");
  const searchParams = useSearchParams();
  const consultationId = searchParams.get("consultation_id");
  const type = searchParams.get("type") as "video" | "chat" | null;

  const endpoint =
    consultationId && type
      ? `/api/consultation-request/consultant/${consultationId}/${type}`
      : null;

  const {
    data: details,
    isLoading,
    error,
  } = useFetcher<ConsultationDetails>(
    ["consultation", "payment", consultationId, type],
    endpoint,
  );

  const createPaymentLinkMutation = useCreatePaymentLink();

  useEffect(() => {
    if (!consultationId || !type) {
      toast.error(t("invalidLink"));
      router.replace("/");
    }
  }, [consultationId, type, router, t]);

  useEffect(() => {
    if (details && isPaidStatus(details.data.financial_status)) {
      router.replace(`/profile/consultations/${details.type}/${details.id}`);
    }
  }, [details, router]);

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

  const financialStatus = details.data.financial_status;

  // ── Payment suspended ────────────────────────────────────────
  if (financialStatus === "payment_suspended") {
    return (
      <>
        <Navbar />
        <BreadcrumbNav currentPage={t("breadcrumb")} />
        <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-primary/5 px-4 py-8">
          <div className="relative z-10 mx-auto max-w-3xl" dir="rtl">
            <Card className="overflow-hidden border-0 shadow-xl">
              <CardContent className="space-y-4 p-6 text-center md:p-8">
                <Clock className="mx-auto h-12 w-12 text-amber-500" />
                <h2 className="text-lg font-bold">{t("suspended.title")}</h2>
                <p className="text-sm text-muted-foreground">
                  {t("suspended.desc")}
                </p>
                <Button asChild>
                  <a
                    href="https://wa.me/96892349692"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle className="ml-2 h-4 w-4" />
                    {t("suspended.contactSupport")}
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </>
    );
  }

  // ── Already paid (direct visit) → redirect in progress ───────
  if (isPaidStatus(financialStatus)) {
    return (
      <>
        <Navbar />
        <BreadcrumbNav currentPage={t("breadcrumb")} />
        <div className="flex min-h-[60vh] items-center justify-center px-4">
          <Card className="w-full max-w-sm border-0 shadow-md">
            <CardContent className="space-y-4 p-6 text-center">
              <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
              <p className="text-sm font-medium">{t("redirectingPaid")}</p>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  // ── Normal payment UI (unpaid) ───────────────────────────────
  if (!isPatientFinancial(details.financial)) return null;

  const handleStartPayment = async () => {
    try {
      const response = await createPaymentLinkMutation.mutateAsync({
        type: details.type,
        consultationId: details.id,
        payment_method: "card",
        card_type: "domestic",
      });

      const checkoutUrl = response?.data?.checkout_url;
      if (!checkoutUrl) {
        throw new Error("Missing checkout URL");
      }

      window.location.href = checkoutUrl;
    } catch (error) {
      console.error("Payment link error", error);
      toast.error(t("paymentLinkError"));
    }
  };

  return (
    <>
      <Navbar />
      <BreadcrumbNav currentPage={t("breadcrumb")} />
      <PaymentForm
        details={details}
        financial={details.financial}
        isMutationPending={createPaymentLinkMutation.isPending}
        onStartPayment={handleStartPayment}
      />
    </>
  );
}
