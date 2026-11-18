"use client";

import { useTranslations } from "next-intl";

import { useState } from "react";
import { Plus } from "lucide-react";
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
        <div className="rounded-xl border bg-white p-10 text-center text-muted-foreground">
          {t("empty")}
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
