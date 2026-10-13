"use client";

import { TriangleAlert } from "lucide-react";
import { useTranslations } from "next-intl";

interface EmergencyNoticeProps {
  phone: string | null | undefined;
}

export function EmergencyNotice({ phone }: EmergencyNoticeProps) {
  const t = useTranslations("kawader");

  return (
    <div
      role="note"
      className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4"
    >
      <TriangleAlert className="mt-0.5 h-5 w-5 shrink-0 text-destructive" aria-hidden />
      <div className="space-y-1 text-sm">
        <p className="font-semibold text-foreground">{t("emergency.title")}</p>
        <p className="text-muted-foreground">{t("emergency.body")}</p>
        {phone ? (
          <p className="text-foreground">
            {t("emergency.callPrefix")}{" "}
            <a href={`tel:${phone}`} className="font-semibold text-destructive underline">
              <bdi>{phone}</bdi>
            </a>
          </p>
        ) : null}
      </div>
    </div>
  );
}
