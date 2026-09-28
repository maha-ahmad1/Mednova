"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { useRouter } from "@/i18n/navigation";
import { Badge } from "@/components/ui/badge";
import { getStatusBadge } from "@/features/consultations/utils/consultation-helpers";
import {
  type ConsultationDetails,
  type AnyConsultationFinancial,
  isPatientFinancial,
} from "@/features/payment/types";

interface ConsultationHeaderProps {
  details: ConsultationDetails;
  financial: AnyConsultationFinancial;
}

export default function ConsultationHeader({
  details,
  financial,
}: ConsultationHeaderProps) {
  const t = useTranslations("consultations.details");
  const tStatus = useTranslations("consultations.status");
  const router = useRouter();

  const party = isPatientFinancial(financial)
    ? details.data.consultant
    : details.data.patient;

  const typeBadgeKey =
    details.type === "video" ? "header.typeVideo" : "header.typeChat";

  const getStatusLabel = (status: string) =>
    tStatus(
      status as "pending" | "accepted" | "cancelled" | "active" | "completed",
    );

  return (
    <div className="space-y-3">
      {/* App bar — mobile only */}
      <div className="flex items-center gap-1 md:hidden">
        <button
          type="button"
          aria-label={t("header.back")}
          onClick={() => router.back()}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-gray-600 active:bg-gray-100"
        >
          <ArrowRight className="h-5 w-5 rtl:rotate-180" />
        </button>
        <h1 className="min-w-0 flex-1 truncate text-base font-semibold">
          {party.full_name}
        </h1>
      </div>
      <div className="flex items-center gap-2 ps-1 md:hidden">
        {getStatusBadge(details.data.status, getStatusLabel)}
        <Badge variant="secondary" className="bg-primary/10 text-primary">
          {t(typeBadgeKey)}
        </Badge>
      </div>

      {/* Header row — md and up (unchanged design) */}
      <div className="hidden flex-wrap items-center justify-between gap-3 border-b border-border/40 pb-4 md:flex">
        <div className="flex items-center gap-4">
          <div className="relative shrink-0">
            <Image
              src={party.image ?? "/images/placeholder.svg"}
              alt={party.full_name}
              width={56}
              height={56}
              className="h-14 w-14 rounded-full border-2 border-white object-cover shadow-md"
            />
            <span className="absolute -bottom-0.5 -left-0.5 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-emerald-500">
              <CheckCircle2 className="h-2.5 w-2.5 text-white" />
            </span>
          </div>
          <div>
            <p className="text-base font-semibold">{party.full_name}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {t("header.idBadge", { id: details.id })}
            </p>
          </div>
        </div>

        <Badge
          variant="secondary"
          className="bg-primary/10 text-primary"
        >
          {t(typeBadgeKey)}
        </Badge>
      </div>
    </div>
  );
}
