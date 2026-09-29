"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@/i18n/navigation";
import { ConfirmationModal } from "@/features/control-panel/users/ui/components/ConfirmationModal";
import { useConsultantPrograms } from "../hooks/useConsultantPrograms";
import { useDeleteConsultantProgram } from "../hooks/useDeleteConsultantProgram";
import { useArchiveConsultantProgram } from "../hooks/useArchiveConsultantProgram";
import { useSubmitConsultantProgramForReview } from "../hooks/useSubmitConsultantProgramForReview";
import { ConsultantProgramCard } from "./components/ConsultantProgramCard";

type PendingAction = { type: "delete" | "archive"; programId: number } | null;

function ConsultantProgramsSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, index) => (
        <Skeleton key={`consultant-program-skeleton-${index}`} className="h-40 w-full rounded-xl" />
      ))}
    </div>
  );
}

export function ConsultantProgramsListPage() {
  const { data, isLoading, isError } = useConsultantPrograms();
  const { mutateAsync: deleteProgram, isPending: isDeleting } = useDeleteConsultantProgram();
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);

  const programs = data?.data ?? [];

  return (
    <div className="mx-auto w-full max-w-5xl space-y-5 p-4 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold text-foreground">كورساتي</h1>
          <p className="text-sm text-muted-foreground">
            أدر كورساتك التدريبية: الإنشاء، الفيديوهات، الإرسال للمراجعة، والمبيعات.
          </p>
        </div>
        <Button asChild>
          <Link href="/profile/programs/new">
            <Plus className="ms-1 h-4 w-4" />
            كورس جديد
          </Link>
        </Button>
      </div>

      {isLoading && <ConsultantProgramsSkeleton />}

      {!isLoading && isError && (
        <div className="rounded-xl border bg-white p-10 text-center text-destructive">
          تعذر تحميل كورساتك. حاول مرة أخرى.
        </div>
      )}

      {!isLoading && !isError && programs.length === 0 && (
        <div className="rounded-xl border bg-white p-10 text-center text-muted-foreground">
          لا توجد كورسات بعد. ابدأ بإنشاء كورسك الأول.
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
        title="حذف الكورس"
        description="هل أنت متأكد أنك تريد حذف هذا الكورس؟ لا يمكن التراجع عن هذا الإجراء."
        confirmLabel="حذف"
        cancelLabel="إلغاء"
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
      onSubmitForReview={() => submitForReview()}
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
  const { archiveProgram, isLoading } = useArchiveConsultantProgram(programId ?? 0);

  return (
    <ConfirmationModal
      open={programId !== null}
      title="أرشفة الكورس"
      description="بعد الأرشفة سيتوقف بيع الكورس لعملاء جدد، لكن المشترين الحاليين سيحتفظون بوصولهم الكامل لمحتوى الكورس."
      confirmLabel="أرشفة"
      cancelLabel="إلغاء"
      isConfirming={isLoading}
      onConfirm={async () => {
        await archiveProgram();
        onClose();
      }}
      onOpenChange={(open) => !open && onClose()}
    />
  );
}
