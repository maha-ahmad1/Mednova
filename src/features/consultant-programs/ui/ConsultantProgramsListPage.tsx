"use client";

import { useTranslations } from "next-intl";

import { useState } from "react";
import { BookOpen, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { ConfirmationModal } from "@/features/control-panel/users/ui/components/ConfirmationModal";
import { classifyApiError } from "@/lib/classifyApiError";
import { ErrorState } from "@/shared/ui/components/states/ErrorState";
import { useConsultantPrograms } from "../hooks/useConsultantPrograms";
import { useDeleteConsultantProgram } from "../hooks/useDeleteConsultantProgram";
import { useArchiveConsultantProgram } from "../hooks/useArchiveConsultantProgram";
import { useSubmitConsultantProgramForReview } from "../hooks/useSubmitConsultantProgramForReview";
import { ConsultantProgramCard } from "./components/ConsultantProgramCard";
import { ConsultantProgramsSkeleton } from "./components/ConsultantProgramsSkeleton";

type PendingAction = { type: "delete" | "archive"; programId: number } | null;

export function ConsultantProgramsListPage() {
  const t = useTranslations("consultantPrograms.list");
  const { data, isLoading, isError, error, refetch } = useConsultantPrograms();
  const classified = classifyApiError(error);
  const { mutateAsync: deleteProgram, isPending: isDeleting } = useDeleteConsultantProgram();
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);

  const programs = data?.data ?? [];

  return (
    <div className="mx-auto w-full max-w-5xl space-y-5 p-4 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold text-foreground">{t("title")}</h1>
          <p className="text-sm text-muted-foreground">
            {t("subtitle")}
          </p>
        </div>
        <Button asChild>
          <Link href="/profile/programs/new">
            <Plus className="ms-1 h-4 w-4" />
            {t("newCourse")}
          </Link>
        </Button>
      </div>

      {isLoading && <ConsultantProgramsSkeleton />}

      {!isLoading && isError && (
        <ErrorState
          title={classified.title}
          description={classified.message}
          onRetry={() => refetch()}
        />
      )}

      {!isLoading && !isError && programs.length === 0 && (
        <div className="rounded-2xl border border-dashed border-[#32A88D]/30 bg-white px-6 py-12 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#32A88D]/10">
            <BookOpen className="h-8 w-8 text-[#32A88D]" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900">{t("emptyTitle")}</h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
            {t("emptyDesc")}
          </p>

          {/* What happens next, so the first step feels small. */}
          <ol className="mx-auto mt-6 flex max-w-lg flex-col items-center gap-3 text-sm text-gray-700 sm:flex-row sm:justify-center sm:gap-6">
            {(["emptyStep1", "emptyStep2", "emptyStep3"] as const).map((key, index) => (
              <li key={key} className="flex items-center gap-2">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#32A88D] text-xs font-semibold text-white">
                  {index + 1}
                </span>
                {t(key)}
              </li>
            ))}
          </ol>

          <div className="mt-8 flex justify-center">
            <Button asChild size="lg" className="w-auto bg-[#32A88D] px-8 hover:bg-[#2a8a7a]">
              <Link href="/profile/programs/new">
                <Plus className="me-1 h-4 w-4" />
                {t("emptyCta")}
              </Link>
            </Button>
          </div>
        </div>
      )}

      {!isLoading && !isError && programs.length > 0 && (
        <div className="space-y-4">
          {programs.map((program) => (
            <ConsultantProgramCardWithActions
              key={program.id}
              programId={program.id}
              program={program}
              onRequestDelete={() => setPendingAction({ type: "delete", programId: program.id })}
              onRequestArchive={() => setPendingAction({ type: "archive", programId: program.id })}
            />
          ))}
        </div>
      )}

      <ConfirmationModal
        open={pendingAction?.type === "delete"}
        title={t("deleteTitle")}
        description={t("deleteDesc")}
        confirmLabel={t("delete")}
        cancelLabel={t("cancel")}
        confirmVariant="destructive"
        isConfirming={isDeleting}
        onConfirm={async () => {
          if (!pendingAction) return;
          await deleteProgram(pendingAction.programId);
          setPendingAction(null);
        }}
        onOpenChange={(open) => !open && setPendingAction(null)}
      />

      <ArchiveConfirmationModal
        programId={pendingAction?.type === "archive" ? pendingAction.programId : null}
        onClose={() => setPendingAction(null)}
      />
    </div>
  );
}

function ConsultantProgramCardWithActions({
  programId,
  program,
  onRequestDelete,
  onRequestArchive,
}: {
  programId: number;
  program: Parameters<typeof ConsultantProgramCard>[0]["program"];
  onRequestDelete: () => void;
  onRequestArchive: () => void;
}) {
  const { submitForReview, isLoading: isSubmitting } = useSubmitConsultantProgramForReview(programId);

  return (
    <ConsultantProgramCard
      program={program}
      onSubmitForReview={() => {
        if (isSubmitting) return;
        submitForReview();
      }}
      onArchive={onRequestArchive}
      onDelete={onRequestDelete}
      isSubmitting={isSubmitting}
    />
  );
}

function ArchiveConfirmationModal({
  programId,
  onClose,
}: {
  programId: number | null;
  onClose: () => void;
}) {
  const t = useTranslations("consultantPrograms.list");
  const { archiveProgram, isLoading } = useArchiveConsultantProgram(programId ?? 0);

  return (
    <ConfirmationModal
      open={programId !== null}
      title={t("archiveTitle")}
      description={t("archiveDesc")}
      confirmLabel={t("archive")}
      cancelLabel={t("cancel")}
      isConfirming={isLoading}
      onConfirm={async () => {
        await archiveProgram();
        onClose();
      }}
      onOpenChange={(open) => !open && onClose()}
    />
  );
}
