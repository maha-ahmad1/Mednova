"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import {
  Calendar,
  CheckCircle2,
  Clock,
  CreditCard,
  Loader2,
  Lock,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Stethoscope,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  type ConsultationDetails,
  type PatientFinancial,
} from "@/features/payment/types";
import { StepIndicator } from "@/features/payment/ui/StepIndicator";

export interface PaymentFormProps {
  details: ConsultationDetails;
  financial: PatientFinancial;
  isMutationPending: boolean;
  onStartPayment: () => Promise<void>;
}

export function PaymentForm({
  details,
  financial,
  isMutationPending,
  onStartPayment,
}: PaymentFormProps) {
  const t = useTranslations("payment");

  const amount = financial.consultation_price;
  const platformFee = financial.gateway_commission_amount;
  const total = financial.gross_amount;
  const currency = "OMR";
  const consultationTypeLabel =
    details.type === "chat" ? t("typeChat") : t("typeVideo");

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-primary/5 px-4 py-8">
      {/* Background decorative blobs */}
      <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-emerald-100/30 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-3xl space-y-6" dir="rtl">
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
                        {details.data.appointment.requested_day
                          .charAt(0)
                          .toUpperCase() +
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
                    <span className="text-muted-foreground">
                      {t("platformFee")}
                    </span>
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
                onClick={onStartPayment}
                disabled={isMutationPending}
                className={cn(
                  "group relative w-full bg-gradient-to-r from-primary to-primary/90 py-6 text-base font-semibold shadow-md",
                  "transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 disabled:opacity-70",
                )}
              >
                <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                {isMutationPending ? (
                  <>
                    <Loader2 className="ml-2 h-5 w-5 animate-spin" />
                    {t("buttonCreatingLink")}
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
  );
}
