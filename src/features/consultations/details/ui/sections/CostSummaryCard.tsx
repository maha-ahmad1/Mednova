"use client";

import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  type AnyConsultationFinancial,
  isPatientFinancial,
  isConsultantFinancial,
} from "@/features/payment/types";

interface CostSummaryCardProps {
  financial: AnyConsultationFinancial;
}

export default function CostSummaryCard({ financial }: CostSummaryCardProps) {
  const t = useTranslations("consultations.details.cost");
  const currency = t("currency");

  if (isPatientFinancial(financial)) {
    return (
      <Card className="border-0 shadow-xl">
        <CardContent className="space-y-4 p-6">
          <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            {t("title")}
          </p>
          <div className="rounded-xl border border-border/40 bg-card/30 p-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  {t("consultationPrice")}
                </span>
                <span className="font-medium tabular-nums">
                  {financial.consultation_price} {currency}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t("gatewayFee")}</span>
                <span className="font-medium tabular-nums">
                  {financial.gateway_commission_amount} {currency}
                </span>
              </div>
              <Separator className="my-2" />
              <div className="flex items-center justify-between">
                <span className="font-semibold">{t("totalAmount")}</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-primary tabular-nums">
                    {financial.gross_amount}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {currency}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isConsultantFinancial(financial)) {
    return (
      <Card className="border-0 shadow-xl">
        <CardContent className="space-y-4 p-6">
          <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            {t("title")}
          </p>
          <div className="rounded-xl border border-border/40 bg-card/30 p-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  {t("consultationPrice")}
                </span>
                <span className="font-medium tabular-nums">
                  {financial.consultation_price} {currency}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t("platformFee")}</span>
                <span className="font-medium tabular-nums">
                  {financial.platform_commission_amount} {currency}
                </span>
              </div>
              <Separator className="my-2" />
              <div className="flex items-center justify-between">
                <span className="font-semibold">{t("yourEarning")}</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-primary tabular-nums">
                    {financial.your_earning}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {currency}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return null;
}
