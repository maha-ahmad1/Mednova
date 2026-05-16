"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { CreditCard, Video, MessageCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { FinancialStatus } from "@/features/payment/types";

interface ConsultationActionsBarProps {
  consultationId: number;
  consultationType: "video" | "chat";
  financialStatus: FinancialStatus;
  videoRoomLink: string | null;
}

export default function ConsultationActionsBar({
  consultationId,
  consultationType,
  financialStatus,
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

        <div className="flex flex-col items-start gap-0.5">
          <Button disabled variant="outline" className="gap-2">
            <XCircle className="h-4 w-4" />
            {t("cancel")}
          </Button>
          <span className="text-xs text-muted-foreground opacity-70 text-center">
            {t("comingSoon")}
          </span>
        </div>
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
                {t("viewZoom")}
              </a>
            </Button>
          ) : (
            <div className="flex flex-col items-start gap-0.5">
              <Button disabled variant="outline" className="gap-2">
                <Video className="h-4 w-4" />
                {t("viewZoom")}
              </Button>
              <span className="text-xs text-muted-foreground opacity-70">
                {t("zoomPending")}
              </span>
            </div>
          )
        ) : (
          <Button asChild variant="outline" className="gap-2">
            <Link href="/profile/chat">
              <MessageCircle className="h-4 w-4" />
              {t("openChat")}
            </Link>
          </Button>
        )}
      </div>
    );
  }

  return null;
}
