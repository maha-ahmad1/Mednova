"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ErrorState } from "@/shared/ui/components/states/ErrorState";
import { useKawaderServices } from "../../hooks/useKawaderServices";
import type { KawaderRequest } from "../../types/kawader";
import { KawaderRequestForm } from "./components/KawaderRequestForm";
import { KawaderRequestFormSkeleton } from "./components/KawaderRequestFormSkeleton";
import { KawaderRequestSuccess } from "./components/KawaderRequestSuccess";

export function KawaderRequestFormPage() {
  const t = useTranslations("kawader");
  const { data, isPending, isError, refetch } = useKawaderServices();
  const [createdRequest, setCreatedRequest] = useState<KawaderRequest | null>(null);

  const renderContent = () => {
    if (createdRequest) return <KawaderRequestSuccess request={createdRequest} />;
    if (isError) {
      return (
        <ErrorState
          title={t("states.errorTitle")}
          description={t("states.errorDescription")}
          onRetry={() => void refetch()}
        />
      );
    }
    // `isPending` (not `isLoading`): the query stays disabled until the session is ready.
    if (isPending || !data) return <KawaderRequestFormSkeleton />;

    return <KawaderRequestForm servicesData={data} onCreated={setCreatedRequest} />;
  };

  return (
    <div className="mx-auto w-full max-w-3xl space-y-5 p-4 sm:p-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold text-foreground">{t("form.title")}</h1>
        <p className="text-sm text-muted-foreground">{t("form.subtitle")}</p>
      </div>

      {renderContent()}
    </div>
  );
}
