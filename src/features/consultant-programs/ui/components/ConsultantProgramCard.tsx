"use client";

import { useLocale, useTranslations } from "next-intl";

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { AlertTriangle, Archive, BookOpen, Loader2, Pencil, Plus, Send, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { ConsultantProgram } from "../../types/consultant-program";
import { ConsultantProgramStatusBadge } from "./ConsultantProgramStatusBadge";

interface ConsultantProgramCardProps {
  program: ConsultantProgram;
  onSubmitForReview: () => void;
  onArchive: () => void;
  onDelete: () => void;
  isSubmitting?: boolean;
  isArchiving?: boolean;
}

export function ConsultantProgramCard({
  program,
  onSubmitForReview,
  onArchive,
  onDelete,
  isSubmitting = false,
  isArchiving = false,
}: ConsultantProgramCardProps) {
  const t = useTranslations("consultantPrograms.card");
  const locale = useLocale();
  return (
    <Card className="overflow-hidden">
      <div className="flex flex-col sm:flex-row">
        <div className="relative h-40 w-full shrink-0 bg-muted sm:h-auto sm:w-48">
          {program.cover_image ? (
            <Image
              src={program.cover_image}
              alt={locale === "en" ? program.title_en : program.title_ar}
              fill
              className="object-cover"
              unoptimized
            />
          ) : (
            // Programs created before the cover became required.
            <div className="flex h-full min-h-40 w-full items-center justify-center bg-[#32A88D]/10">
              <BookOpen className="h-10 w-10 text-[#32A88D]/60" />
            </div>
          )}
        </div>

        <CardContent className="flex flex-1 flex-col gap-3 p-4">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-foreground">{locale === "en" ? program.title_en : program.title_ar}</h3>
              <p className="text-sm text-muted-foreground">
                {t("summary", { price: program.price ?? "—", videos: program.videos.length, sales: program.sales_count })}
              </p>
              <p className="text-xs text-muted-foreground">
                {t("commission", { rate: program.platform_commission_rate, earning: program.your_earning_per_sale })}
              </p>
            </div>
            <ConsultantProgramStatusBadge status={program.status} label={program.status_label} />
          </div>

          {program.status === "rejected" && program.rejection_reason && (
            <div className="flex items-start gap-2 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{program.rejection_reason}</span>
            </div>
          )}

          <div className="mt-auto flex flex-wrap gap-2 pt-2">
            {program.can.edit && (
              <Button asChild variant="outline" size="sm">
                <Link href={`/profile/programs/${program.id}/edit`}>
                  <Pencil className="ms-1 h-4 w-4" />
                  {t("edit")}
                </Link>
              </Button>
            )}
            {!program.can.edit && (
              <Button asChild variant="outline" size="sm">
                <Link href={`/profile/programs/${program.id}/edit`}>{t("viewDetails")}</Link>
              </Button>
            )}
            {program.can.add_video && (
              <Button asChild variant="outline" size="sm">
                <Link href={`/profile/programs/${program.id}/edit`}>
                  <Plus className="ms-1 h-4 w-4" />
                  {t("addVideo")}
                </Link>
              </Button>
            )}
            {program.can.submit && (
              <Button size="sm" className="min-w-36" onClick={onSubmitForReview} disabled={isSubmitting}>
                {isSubmitting ? (
                  <Loader2 className="ms-1 h-4 w-4 animate-spin" />
                ) : (
                  <Send className="ms-1 h-4 w-4" />
                )}
                {isSubmitting ? t("submitting") : t("submitForReview")}
              </Button>
            )}
            {program.can.archive && (
              <Button variant="outline" size="sm" className="min-w-28" onClick={onArchive} disabled={isArchiving}>
                {isArchiving ? (
                  <Loader2 className="ms-1 h-4 w-4 animate-spin" />
                ) : (
                  <Archive className="ms-1 h-4 w-4" />
                )}
                {isArchiving ? t("archiving") : t("archive")}
              </Button>
            )}
            {program.can.delete && (
              <Button variant="destructive" size="sm" onClick={onDelete}>
                <Trash2 className="ms-1 h-4 w-4" />
                {t("delete")}
              </Button>
            )}
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
