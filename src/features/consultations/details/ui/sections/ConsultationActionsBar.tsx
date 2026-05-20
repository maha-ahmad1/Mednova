"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { CreditCard, Video, MessageCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { FinancialStatus, ConsultationStatus, AnyConsultationFinancial } from "@/features/payment/types";
import { isPatientFinancial } from "@/features/payment/types";

interface ConsultationActionsBarProps {
  consultationId: number;
  consultationType: "video" | "chat";
  financialStatus: FinancialStatus;
  status: ConsultationStatus;
  financial: AnyConsultationFinancial;
  videoRoomLink: string | null;
}

export default function ConsultationActionsBar({
  consultationId,
  consultationType,
  financialStatus,
  status,
  financial,
  videoRoomLink,
}: ConsultationActionsBarProps) {
  const t = useTranslations("consultations.details.actions");

  if (financialStatus === "unpaid") {
    return (
      <div className="flex flex-wrap gap-3">
        <Button asChild className="gap-2">
          <Link
            href={`/payment?consultation_id=${consultationId}&type=${consultationType}`}
          >
            <CreditCard className="h-4 w-4" />
            {t("completePayment")}
          </Link>
        </Button>
      </div>
    );
  }

  if (financialStatus === "held") {
    if (status === "pending") {
      const isPatient = isPatientFinancial(financial);
      return (
        <div className="rounded-xl border border-amber-200/60 bg-amber-50/40 p-4">
          <div className="flex items-start gap-3">
            <Clock className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
            <div className="space-y-1">
              <p className="text-sm font-semibold text-amber-800">
                {isPatient ? t("waitingForAccept.titlePatient") : t("waitingForAccept.titleConsultant")}
              </p>
              <p className="text-xs text-amber-700">
                {isPatient ? t("waitingForAccept.descPatient") : t("waitingForAccept.descConsultant")}
              </p>
            </div>
          </div>
        </div>
      );
    }

    if (!["accepted", "active"].includes(status)) {
      return null;
    }

    return (
      <div className="flex flex-wrap gap-3">
        {consultationType === "video" ? (
          videoRoomLink ? (
            <Button asChild className="gap-2">
              <a
                href={videoRoomLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Video className="h-4 w-4" />
                {t("startZoom")}
              </a>
            </Button>
          ) : (
            <div className="flex flex-col items-start gap-0.5">
              <Button disabled className="gap-2">
                <Video className="h-4 w-4" />
                {t("startZoom")}
              </Button>
              <span className="text-xs text-muted-foreground opacity-70">
                {t("zoomPending")}
              </span>
            </div>
          )
        ) : (
          <Button asChild className="gap-2">
            <Link href="/profile/chat">
              <MessageCircle className="h-4 w-4" />
              {t("openChat")}
            </Link>
          </Button>
        )}
      </div>
    );
  }

  if (financialStatus === "review_window") {
    return (
      <div className="flex flex-wrap gap-3">
        {consultationType === "video" ? (
          videoRoomLink ? (
            <Button asChild variant="outline" className="gap-2">
              <a
                href={videoRoomLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Video className="h-4 w-4" />
                {t("reviewZoom")}
              </a>
            </Button>
          ) : (
            <div className="flex flex-col items-start gap-0.5">
              <Button disabled variant="outline" className="gap-2">
                <Video className="h-4 w-4" />
                {t("reviewZoom")}
              </Button>
              <span className="text-xs text-muted-foreground opacity-70">
                {t("zoomNotAvailable")}
              </span>
            </div>
          )
        ) : (
          <Button asChild variant="outline" className="gap-2">
            <Link href="/profile/chat">
              <MessageCircle className="h-4 w-4" />
              {t("reviewChat")}
            </Link>
          </Button>
        )}
      </div>
    );
  }

  return null;
}
