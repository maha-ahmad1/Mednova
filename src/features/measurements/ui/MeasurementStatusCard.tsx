"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Copy, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ConsultationRequest } from "@/types/consultation";
import { useCancelMeasurement } from "../hooks/useCancelMeasurement";
import { formatCountdown } from "../utils/formatCountdown";
import type { Measurement, MeasurementStatus } from "../types";

interface MeasurementStatusCardProps {
  measurement: Measurement;
  request: ConsultationRequest;
}

// Reuses the amber/pending hue already established by getStatusBadge in
// consultation-helpers.tsx, plus the blue already used there for "active",
// rather than inventing new status colors for this card.
const STATUS_DOT_CLASS: Partial<Record<MeasurementStatus, string>> = {
  pending: "bg-amber-500",
  in_progress: "bg-blue-500",
};

export default function MeasurementStatusCard({
  measurement,
  request,
}: MeasurementStatusCardProps) {
  const t = useTranslations();
  const cancelMutation = useCancelMeasurement(request.type, request.id);

  const [countdown, setCountdown] = useState(() =>
    formatCountdown(measurement.expires_at),
  );

  useEffect(() => {
    setCountdown(formatCountdown(measurement.expires_at));
    const intervalId = setInterval(() => {
      setCountdown(formatCountdown(measurement.expires_at));
    }, 1000);

    return () => clearInterval(intervalId);
  }, [measurement.measurement_id, measurement.expires_at]);

  const expired = countdown.expired;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(measurement.patient_url);
      toast.success(t("measurements.linkCopied"));
    } catch {
      toast.error(t("measurements.apiMessages.ERROR_OCCURRED"));
    }
  };

  return (
    <Card className="bg-gradient-to-b from-white to-gray-50/50 border border-gray-200 rounded-xl sm:rounded-2xl shadow-lg mt-4 sm:mt-6">
      <CardContent className="p-4 sm:p-6 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full shrink-0 ${
                STATUS_DOT_CLASS[measurement.status] ?? "bg-gray-400"
              }`}
            />
            <span className="font-semibold text-gray-800 text-sm sm:text-base">
              {measurement.status_label}
            </span>
          </div>
          {expired ? (
            <span className="text-xs sm:text-sm text-muted-foreground">
              {t("measurements.expiredLabel")}
            </span>
          ) : (
            <span className="text-sm sm:text-base font-mono font-semibold text-gray-800">
              {countdown.label}
            </span>
          )}
        </div>

        <Button
          type="button"
          onClick={() => window.open(measurement.therapist_url, "_blank")}
          disabled={expired}
          className="cursor-pointer w-full bg-gradient-to-r from-[#32A88D] to-[#2a8a7a] hover:from-[#2a8a7a] hover:to-[#32A88D] text-white rounded-lg sm:rounded-xl px-4 sm:px-8 py-2 sm:py-3 flex items-center justify-center gap-2"
        >
          {t("measurements.joinButton")}
        </Button>

        <div className="flex items-center gap-2">
          <Input
            readOnly
            value={measurement.patient_url}
            className="flex-1 bg-[#32A88D]/10 text-gray-700 border-transparent cursor-text"
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label={t("measurements.copyLinkAriaLabel")}
            onClick={handleCopyLink}
            className="cursor-pointer shrink-0"
          >
            <Copy className="w-4 h-4" />
          </Button>
        </div>

        <Button
          type="button"
          variant="outline"
          disabled={cancelMutation.isPending}
          onClick={() => cancelMutation.mutate(measurement.measurement_id)}
          className="cursor-pointer w-full"
        >
          {cancelMutation.isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              {t("measurements.cancelling")}
            </>
          ) : (
            t("measurements.cancelMeasurementButton")
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
