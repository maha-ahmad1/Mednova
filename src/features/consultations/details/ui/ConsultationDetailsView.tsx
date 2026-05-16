"use client";

import { useTranslations } from "next-intl";
import { Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useConsultationDetails } from "@/features/consultations/details/hooks/useConsultationDetails";

interface ConsultationDetailsViewProps {
  id: string;
  type: "video" | "chat";
}

export default function ConsultationDetailsView({
  id,
  type,
}: ConsultationDetailsViewProps) {
  const t = useTranslations("consultations.details");
  const { data: details, isLoading, error } = useConsultationDetails(id, type);

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">{t("loading")}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[400px] items-center justify-center px-4">
        <Card className="w-full max-w-sm border-0 shadow-xl">
          <CardContent className="space-y-4 p-6 text-center">
            <X className="mx-auto h-10 w-10 text-rose-500" />
            <p className="font-semibold">{t("loadError")}</p>
            <Button
              onClick={() => window.location.reload()}
              variant="outline"
              className="w-full"
            >
              {t("retry")}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!details) {
    return (
      <div className="flex min-h-[400px] items-center justify-center px-4">
        <Card className="w-full max-w-sm border-0 shadow-xl">
          <CardContent className="p-6 text-center">
            <p className="font-semibold">{t("notFound")}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Card className="border-0 shadow-xl">
        <CardContent className="p-6">
          <p className="text-sm text-muted-foreground">id: {details.id}</p>
          <p className="text-sm text-muted-foreground">type: {details.type}</p>
          <p className="text-sm text-muted-foreground">
            financial_status: {details.data.financial_status}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
