"use client";

import { CalendarClock, ChevronRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { KawaderRequest } from "../../../types/kawader";
import { formatKawaderDate } from "../../../utils/kawader-datetime";
import { KawaderStatusBadge } from "../../shared/KawaderStatusBadge";

interface KawaderRequestCardProps {
  request: KawaderRequest;
}

export function KawaderRequestCard({ request }: KawaderRequestCardProps) {
  const t = useTranslations("kawader");
  const locale = useLocale();

  return (
    <Link
      href={`/profile/kawader/${request.id}`}
      className="block rounded-xl border bg-white p-4 transition-colors hover:border-primary/50 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-primary/40"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-sm font-semibold text-primary">
            <bdi>{request.reference_code}</bdi>
          </p>
          <h3 className="text-base font-semibold text-foreground">{request.service.name}</h3>
          {request.service_area?.name ? (
            <p className="text-sm text-muted-foreground">{request.service_area.name}</p>
          ) : null}
        </div>
        <KawaderStatusBadge status={request.status} label={request.status_label} />
      </div>

      <div className="mt-3 flex items-center justify-between gap-3 text-sm text-muted-foreground">
        <span className="flex items-center gap-2">
          <CalendarClock className="h-4 w-4 shrink-0" aria-hidden />
          <span className="sr-only">{t("list.preferredAt")}:</span>
          {formatKawaderDate(request.preferred_at, locale)}
        </span>
        <ChevronRight
          className="h-4 w-4 shrink-0 rtl:rotate-180"
          aria-hidden
        />
      </div>
    </Link>
  );
}
