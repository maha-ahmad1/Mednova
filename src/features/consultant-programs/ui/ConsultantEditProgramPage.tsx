"use client";

import { useTranslations } from "next-intl";

import { ArrowLeft } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { classifyApiError } from "@/lib/classifyApiError";
import { ErrorState } from "@/shared/ui/components/states/ErrorState";
import { useConsultantProgramDetail } from "../hooks/useConsultantProgramDetail";
import { ConsultantProgramForm } from "./ConsultantProgramForm";
import { ConsultantProgramFormSkeleton } from "./components/ConsultantProgramFormSkeleton";

interface ConsultantEditProgramPageProps {
  programId: number;
}

export function ConsultantEditProgramPage({ programId }: ConsultantEditProgramPageProps) {
  const t = useTranslations("consultantPrograms.edit");
  const tApi = useTranslations("apiErrors");
  const { data, isLoading, isError, error, refetch } = useConsultantProgramDetail(programId);
  const program = data?.data;

  if (isLoading) {
    return <ConsultantProgramFormSkeleton />;
  }

  if (isError || !program) {
    const { title, message } = isError
      ? classifyApiError(error)
      : { title: tApi("genericTitle"), message: t("loadError") };

    return (
      <div className="mx-auto w-full max-w-5xl space-y-3 p-4 sm:p-6">
        <ErrorState
          title={title}
          description={message}
          onRetry={() => refetch()}
        />
        <Card>
          <CardContent className="space-y-3 pt-6 text-center">
            <Button asChild variant="outline">
              <Link href="/profile/programs">{t("backToList")}</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl space-y-5 p-4 sm:p-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">{t("title")}</h1>
          <p className="text-sm text-muted-foreground">
            {t("subtitle")}
          </p>
        </div>
        <Button asChild variant="outline" className="gap-2">
          <Link href="/profile/programs">
            <ArrowLeft className="h-4 w-4" />
            {t("back")}
          </Link>
        </Button>
      </div>

      <ConsultantProgramForm mode="edit" program={program} />
    </div>
  );
}
