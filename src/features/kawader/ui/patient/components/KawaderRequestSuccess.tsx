"use client";

import { CheckCircle2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import type { KawaderRequest } from "../../../types/kawader";

interface KawaderRequestSuccessProps {
  request: KawaderRequest;
}

export function KawaderRequestSuccess({ request }: KawaderRequestSuccessProps) {
  const t = useTranslations("kawader");

  return (
    <div className="space-y-6 rounded-xl border bg-white p-6 text-center sm:p-10">
      <CheckCircle2 className="mx-auto h-14 w-14 text-primary" aria-hidden />

      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-foreground">{t("success.title")}</h2>
        <p className="mx-auto max-w-md text-sm text-muted-foreground">{t("success.body")}</p>
      </div>

      <div className="mx-auto w-fit rounded-lg bg-primary/10 px-6 py-3">
        <p className="text-xs text-muted-foreground">{t("success.reference")}</p>
        <p className="text-lg font-semibold tracking-wide text-primary">
          <bdi>{request.reference_code}</bdi>
        </p>
      </div>

      <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Button asChild>
          <Link href={`/profile/kawader/${request.id}`}>{t("success.viewRequest")}</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/profile/kawader">{t("success.myRequests")}</Link>
        </Button>
      </div>
    </div>
  );
}
