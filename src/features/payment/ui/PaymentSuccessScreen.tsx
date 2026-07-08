"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import Image from "next/image";
import { useNavigationLoader } from "@/hooks/useNavigationLoader";
import { LoadingButton } from "@/shared/ui/LoadingButton";
import { format } from "date-fns";
import { ar, enUS } from "date-fns/locale";
import { Calendar, CheckCircle2, Home, Stethoscope } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  type ConsultationDetails,
  isPatientFinancial,
} from "@/features/payment/types";

export interface PaymentSuccessScreenProps {
  consultationId: number;
  consultationType: "video" | "chat";
  details: ConsultationDetails;
}

export function PaymentSuccessScreen({
  consultationId,
  consultationType,
  details,
}: PaymentSuccessScreenProps) {
  const t = useTranslations("payment");
  const { push, isNavigating } = useNavigationLoader();
  const locale = useLocale();
  const dateLocale = locale === "ar" ? ar : enUS;
  const [count, setCount] = useState(5);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const detailsHref =
    `/profile/consultations/${consultationType}/${consultationId}` as const;

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCount((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          push(detailsHref);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [push, detailsHref]);

  const handleViewDetails = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    push(detailsHref);
  };

  const handleGoHome = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    push("/");
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

      <div className="relative z-10 mx-auto max-w-md space-y-6">
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
                <span className="absolute -bottom-0.5 -start-0.5 flex h-4 w-4 items-center justify-center rounded-full border-2 border-white bg-emerald-500">
                  <CheckCircle2 className="h-2 w-2 text-white" />
                </span>
              </div>
              <div className="min-w-0 flex-1">
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
              <LoadingButton
                onClick={handleViewDetails}
                isLoading={isNavigating}
                loadingText={t("navigating")}
                className="w-full gap-2"
              >
                <CheckCircle2 className="h-4 w-4" />
                {t("success.viewDetails")}
              </LoadingButton>
              <LoadingButton
                onClick={handleGoHome}
                isLoading={isNavigating}
                loadingText={t("navigating")}
                variant="outline"
                className="w-full gap-2"
              >
                <Home className="h-4 w-4" />
                {t("success.goHome")}
              </LoadingButton>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
