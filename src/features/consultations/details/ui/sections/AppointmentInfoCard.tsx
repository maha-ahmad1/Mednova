"use client";

import { useTranslations, useLocale } from "next-intl";
import { format } from "date-fns";
import { ar, enUS } from "date-fns/locale";
import { Calendar, Clock, Video, MapPin, MessageCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { ConsultationDetails } from "@/features/payment/types";

interface AppointmentInfoCardProps {
  details: ConsultationDetails;
}

export default function AppointmentInfoCard({
  details,
}: AppointmentInfoCardProps) {
  const t = useTranslations("consultations.details.appointment");
  const locale = useLocale();
  const dateLocale = locale === "ar" ? ar : enUS;

  if (details.type === "chat") {
    return (
      <Card className="border-0 shadow-xl">
        <CardContent className="space-y-4 p-6">
          <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            {t("title")}
          </p>
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
        </CardContent>
      </Card>
    );
  }

  const isoStr = details.data.appointment.requested_time.replace(" ", "T");
  const dt = new Date(isoStr);
  const isValidDate = !isNaN(dt.getTime());

  const dayName = isValidDate
    ? format(dt, "EEEE", { locale: dateLocale })
    : "—";
  const fullDate = isValidDate
    ? format(dt, "d MMMM yyyy", { locale: dateLocale })
    : "—";
  const time = isValidDate ? format(dt, "HH:mm") : "—";

  return (
    <Card className="border-0 shadow-xl">
      <CardContent className="space-y-4 p-6">
        <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          {t("title")}
        </p>
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
                {dayName} {fullDate}
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
              <p className="text-sm font-semibold">{time}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-border/40 bg-card/30 p-3">
            <div className="rounded-full bg-primary/10 p-2">
              <Video className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-[11px] font-medium uppercase text-muted-foreground">
                {t("platform")}
              </p>
              <p className="text-sm font-semibold">{t("platformValue")}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-border/40 bg-card/30 p-3">
            <div className="rounded-full bg-primary/10 p-2">
              <MapPin className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-[11px] font-medium uppercase text-muted-foreground">
                {t("location")}
              </p>
              <p className="text-sm font-semibold">{t("locationOnline")}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
