"use client";

import { useTranslations } from "next-intl";

import { ArrowLeft } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { ConsultantProgramForm } from "./ConsultantProgramForm";

export function ConsultantCreateProgramPage() {
  const t = useTranslations("consultantPrograms.create");
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

      <ConsultantProgramForm mode="create" />
    </div>
  );
}
