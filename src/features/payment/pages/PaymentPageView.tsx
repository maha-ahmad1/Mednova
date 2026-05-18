"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useRouter, Link } from "@/i18n/navigation";
import { format } from "date-fns";
import { ar, enUS } from "date-fns/locale";
import {
  CheckCircle2,
  Clock,
  CreditCard,
  Loader2,
  ShieldCheck,
  Calendar,
  Lock,
  X,
  Stethoscope,
  Sparkles,
  MessageCircle,
  Home,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Navbar from "@/shared/ui/components/Navbar/Navbar";
import BreadcrumbNav from "@/shared/ui/components/BreadcrumbNav";
import { useCreatePaymentLink } from "@/features/payment/hooks/useCreatePaymentLink";
import { usePaymentStatus } from "@/features/payment/hooks/usePaymentStatus";
import { useFetcher } from "@/hooks/useFetcher";
import {
  type ConsultationDetails,
  isPaid as isPaidStatus,
  isPatientFinancial,
} from "@/features/payment/types";
import { cn } from "@/lib/utils";

/* ─────────────────────────────────────────────
   Sub-components (Stepper & Status)
───────────────────────────────────────────── */

function StepIndicator({ step, label }: { step: number; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary shadow-sm">
        {step}
      </div>
      <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
    </div>
  );
}

type PaymentStatusType = "pending" | "paid" | "failed" | "loading";

const StatusBanner = ({ status }: { status: PaymentStatusType }) => {
  const t = useTranslations("payment");
  const config = {
    loading: {
      icon: <Loader2 className="h-4 w-4 animate-spin text-primary" />,
      title: t("banner.loadingTitle"),
      desc: t("banner.loadingDesc"),
      bg: "from-blue-50/80 to-indigo-50/50",
      text: "text-blue-800",
    },
    paid: {
      icon: <CheckCircle2 className="h-4 w-4 text-emerald-700" />,
      title: t("banner.paidTitle"),
      desc: t("banner.paidDesc"),
      bg: "from-emerald-50/80 to-teal-50/50",
      text: "text-emerald-800",
    },
    failed: {
      icon: <X className="h-4 w-4 text-rose-700" />,
      title: t("banner.failedTitle"),
      desc: t("banner.failedDesc"),
      bg: "from-rose-50/80 to-red-50/50",
      text: "text-rose-800",
    },
    pending: {
      icon: <Clock className="h-4 w-4 text-amber-700" />,
      title: t("banner.pendingTitle"),
      desc: t("banner.pendingDesc"),
      bg: "from-amber-50/80 to-yellow-50/50",
      text: "text-amber-800",
    },
  };

  const c = config[status];
  return (
    <Card className="overflow-hidden border-0 shadow-md">
      <CardContent className={cn("bg-gradient-to-r p-0", c.bg)}>
        <div className="flex items-center gap-3 px-5 py-4">
          <div className="rounded-full bg-white/60 p-1.5 shadow-sm">
            {c.icon}
          </div>
          <div>
            <p className={cn("text-sm font-semibold", c.text)}>{c.title}</p>
            <p className="text-xs text-muted-foreground">{c.desc}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

/* ─────────────────────────────────────────────
   Payment Success Screen
───────────────────────────────────────────── */

interface PaymentSuccessScreenProps {
  consultationId: number;
  consultationType: "video" | "chat";
  details: ConsultationDetails;
}

function PaymentSuccessScreen({
  consultationId,
  consultationType,
  details,
}: PaymentSuccessScreenProps) {
  const t = useTranslations("payment");
  const router = useRouter();
  const locale = useLocale();
  const dateLocale = locale === "ar" ? ar : enUS;
  const [count, setCount] = useState(5);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const detailsHref = `/profile/consultations/${consultationType}/${consultationId}` as const;

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCount((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          router.push(detailsHref);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [router, detailsHref]);

  const handleViewDetails = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    router.push(detailsHref);
  };

  const handleGoHome = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    router.push("/");
  };

  const financial = isPatientFinancial(details.financial)
    ? details.financial
    : null;

  let appointmentDisplay: string | null = null;
  if (consultationType === "video") {
    const isoStr = details.data.appointment.requested_time.replace(" ", "T");
    const dt = new Date(isoStr);
    if (!isNaN(dt.getTime())) {
      const dayName = format(dt, "EEEE", { locale: dateLocale });
      const fullDate = format(dt, "d MMMM yyyy", { locale: dateLocale });
      const time = format(dt, "HH:mm");
      appointmentDisplay = `${dayName} ${fullDate} — ${time}`;
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-primary/5 px-4 py-8">
      <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-emerald-100/30 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-md space-y-6" dir="rtl">
        <Card className="overflow-hidden border-0 shadow-xl">
          <CardContent className="space-y-6 p-6 text-center md:p-8">
            <div className="flex justify-center">
              <div className="rounded-full bg-emerald-100 p-4">
                <CheckCircle2 className="h-14 w-14 text-emerald-500" />
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold">{t("success.title")}</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {t("success.subtitle")}
              </p>
            </div>

            {/* Provider mini-card */}
            <div className="flex items-center gap-3 rounded-xl border border-border/40 bg-card/30 p-4 text-start">
              <div className="relative shrink-0">
                <Image
                  src={
                    details.data.consultant.image || "/images/placeholder.svg"
                  }
                  alt={details.data.consultant.full_name}
                  width={44}
                  height={44}
                  className="h-11 w-11 rounded-full border-2 border-white object-cover shadow-md"
                />
                <span className="absolute -bottom-0.5 -left-0.5 flex h-4 w-4 items-center justify-center rounded-full border-2 border-white bg-emerald-500">
                  <CheckCircle2 className="h-2 w-2 text-white" />
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-semibold">
                  {details.data.consultant.full_name}
                </p>
                <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                  <Stethoscope className="h-3 w-3 shrink-0" />
                  {t("verifiedSpecialist")}
                </p>
              </div>
            </div>

            {/* Appointment (video only) */}
            {appointmentDisplay && (
              <div className="flex items-center gap-3 rounded-xl border border-border/40 bg-card/30 p-3 text-start">
                <div className="rounded-full bg-primary/10 p-2">
                  <Calendar className="h-4 w-4 text-primary" />
                </div>
                <p className="text-sm font-semibold">{appointmentDisplay}</p>
              </div>
            )}

            {/* Amount paid */}
            {financial && (
              <div className="flex items-center justify-between rounded-xl border border-emerald-200/60 bg-emerald-50/40 px-4 py-3">
                <span className="text-sm text-muted-foreground">
                  {t("success.amountPaid")}
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-bold text-primary tabular-nums">
                    {financial.gross_amount}
                  </span>
                  <span className="text-xs text-muted-foreground">OMR</span>
                </div>
              </div>
            )}

            {/* Countdown */}
            <p className="text-xs text-muted-foreground">
              {t("success.redirectingIn", { seconds: count })}
            </p>

            {/* Actions */}
            <div className="flex flex-col gap-3">
              <Button onClick={handleViewDetails} className="w-full gap-2">
                <CheckCircle2 className="h-4 w-4" />
                {t("success.viewDetails")}
              </Button>
              <Button
                onClick={handleGoHome}
                variant="outline"
                className="w-full gap-2"
              >
                <Home className="h-4 w-4" />
                {t("success.goHome")}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main Page Component
───────────────────────────────────────────── */

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

  const isGatewayReturn = useMemo(
    () =>
      ["payment_return", "gateway_payment_id", "biller_ref", "status"].some(
        (key) => searchParams.has(key),
      ),
    [searchParams],
  );

  const { data: paymentStatusData, isLoading: isCheckingStatus } =
    usePaymentStatus({
      consultationId: details?.id,
      enabled: isGatewayReturn,
    });

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

  // ── Gateway return + paid → success screen ──────────────────
  if (isGatewayReturn && isPaidStatus(financialStatus)) {
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

  // ── Already paid (direct visit, no gateway return) ───────────
  if (isPaidStatus(financialStatus)) {
    return (
      <>
        <Navbar />
        <BreadcrumbNav currentPage={t("breadcrumb")} />
        <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-primary/5 px-4 py-8">
          <div className="relative z-10 mx-auto max-w-3xl" dir="rtl">
            <Card className="overflow-hidden border-0 shadow-xl">
              <CardContent className="space-y-4 p-6 text-center md:p-8">
                <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-500" />
                <h2 className="text-lg font-bold">{t("alreadyPaid.title")}</h2>
                <p className="text-sm text-muted-foreground">
                  {t("alreadyPaid.desc")}
                </p>
                <Button asChild variant="outline">
                  <Link href={`/profile/consultations/${details.type}/${details.id}`}>
                    {t("alreadyPaid.viewConsultations")}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </>
    );
  }

  // ── Normal payment UI (unpaid) ───────────────────────────────

  if (!isPatientFinancial(details.financial)) return null;
  const amount = details.financial.consultation_price;
  const platformFee = details.financial.gateway_commission_amount;
  const total = details.financial.gross_amount;
  const currency = "OMR";
  const consultationTypeLabel =
    details.type === "chat" ? t("typeChat") : t("typeVideo");

  const rawStatus = paymentStatusData?.status ?? "pending";
  const paymentStatus: PaymentStatusType = isCheckingStatus
    ? "loading"
    : (rawStatus as PaymentStatusType);

  const isPollingPaid = paymentStatus === "paid";
  const isMutationPending = createPaymentLinkMutation.isPending;

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

      <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-primary/5 px-4 py-8">
        {/* Background decorative blobs */}
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-emerald-100/30 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-3xl space-y-6" dir="rtl">
          {/* Status banner on gateway return */}
          {isGatewayReturn && <StatusBanner status={paymentStatus} />}

          {/* Main Booking Card */}
          <Card className="overflow-hidden border-0 shadow-xl backdrop-blur-sm transition-all duration-300 hover:shadow-2xl">
            <CardContent className="space-y-6 p-6 md:p-8">
              {/* Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/40 pb-4">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-primary" />
                  <h1 className="text-lg font-bold">{t("pageTitle")}</h1>
                </div>
                <Badge variant="secondary" className="bg-primary/10 text-primary">
                  {consultationTypeLabel}
                </Badge>
              </div>

              {/* Step 1: Provider */}
              <div className="space-y-3">
                <StepIndicator step={1} label={t("step1Label")} />
                <div className="flex items-center gap-4 rounded-xl border border-border/40 bg-card/30 p-4 transition-all hover:shadow-sm">
                  <div className="relative shrink-0">
                    <Image
                      src={
                        details.data.consultant.image ||
                        "/images/placeholder.svg"
                      }
                      alt={details.data.consultant.full_name}
                      width={56}
                      height={56}
                      className="h-14 w-14 rounded-full border-2 border-white object-cover shadow-md"
                    />
                    <span className="absolute -bottom-0.5 -left-0.5 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-emerald-500">
                      <CheckCircle2 className="h-2.5 w-2.5 text-white" />
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-base font-semibold">
                      {details.data.consultant.full_name}
                    </p>
                    <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                      <Stethoscope className="h-3 w-3" />
                      {t("verifiedSpecialist")}
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 2: Appointment / Consultation Type */}
              {details.type === "video" ? (
                <div className="space-y-3">
                  <StepIndicator step={2} label={t("step2VideoLabel")} />
                  {/* TODO: replace with i18n key (t(`days.${day}`)) once day keys are
                      added in a later phase. Current Arabic users will see "Friday" not "الجمعة". */}
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="flex items-center gap-3 rounded-xl border border-border/40 bg-card/30 p-3">
                      <div className="rounded-full bg-primary/10 p-2">
                        <Calendar className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-[11px] font-medium uppercase text-muted-foreground">
                          {t("date")}
                        </p>
                        <p className="text-sm font-semibold">
                          {details.data.appointment.requested_day.charAt(0).toUpperCase() +
                            details.data.appointment.requested_day.slice(1)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 rounded-xl border border-border/40 bg-card/30 p-3">
                      <div className="rounded-full bg-primary/10 p-2">
                        <Clock className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-[11px] font-medium uppercase text-muted-foreground">
                          {t("time")}
                        </p>
                        <p className="text-sm font-semibold">
                          {details.data.appointment.requested_time}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <StepIndicator step={2} label={t("step2ChatLabel")} />
                  <div className="flex items-center gap-3 rounded-xl border border-border/40 bg-card/30 p-4">
                    <div className="rounded-full bg-primary/10 p-2">
                      <MessageCircle className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{t("instantChat")}</p>
                      <p className="text-xs text-muted-foreground">
                        {t("instantChatDesc")}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Cost Summary */}
              <div className="space-y-3">
                <StepIndicator step={3} label={t("step3Label")} />
                <div className="rounded-xl border border-border/40 bg-card/30 p-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {t("consultationPrice")}
                      </span>
                      <span className="font-medium tabular-nums">
                        {amount} {currency}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{t("platformFee")}</span>
                      <span className="font-medium tabular-nums">
                        {platformFee} {currency}
                      </span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">{t("totalAmount")}</span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-bold text-primary tabular-nums">
                          {total}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {currency}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Escrow Trust Message */}
              <div className="flex items-start gap-3 rounded-xl border border-amber-200/60 bg-amber-50/40 p-4 backdrop-blur-sm">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
                <div>
                  <p className="flex items-center gap-1 text-sm font-semibold text-amber-900">
                    {t("escrowTitle")}
                    <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-amber-800/80">
                    {t("escrowDesc")}
                  </p>
                </div>
              </div>

              {/* Payment Button + Security */}
              <div className="space-y-4 pt-2">
                <Button
                  onClick={handleStartPayment}
                  disabled={isMutationPending || isPollingPaid}
                  className="group relative w-full bg-gradient-to-r from-primary to-primary/90 py-6 text-base font-semibold shadow-md transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 disabled:opacity-70"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  {isMutationPending ? (
                    <>
                      <Loader2 className="ml-2 h-5 w-5 animate-spin" />
                      {t("buttonCreatingLink")}
                    </>
                  ) : isPollingPaid ? (
                    <>
                      <CheckCircle2 className="ml-2 h-5 w-5" />
                      {t("buttonPaid")}
                    </>
                  ) : (
                    <>
                      <CreditCard className="ml-2 h-5 w-5 transition-transform group-hover:scale-110" />
                      {t("buttonPay", { total, currency })}
                    </>
                  )}
                </Button>

                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                  <Lock className="h-3 w-3" />
                  <span>{t("sslNote")}</span>
                </div>

                <p className="text-center text-[11px] leading-relaxed text-muted-foreground">
                  {t("agreeToTerms")}{" "}
                  <span className="cursor-pointer font-medium text-primary underline-offset-2 hover:underline">
                    {t("terms")}
                  </span>{" "}
                  {t("termsAnd")}{" "}
                  <span className="cursor-pointer font-medium text-primary underline-offset-2 hover:underline">
                    {t("privacy")}
                  </span>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
