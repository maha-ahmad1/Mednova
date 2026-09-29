"use client";

import { useState } from "react";
import { AlertTriangle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmationModal } from "@/features/control-panel/users/ui/components/ConfirmationModal";
import type { ConsultantProgramVideo, ProgramStatus } from "../../types/consultant-program";

const reviewStatusClasses: Record<ConsultantProgramVideo["review_status"], string> = {
  pending: "bg-sky-100 text-sky-700 border-sky-200",
  approved: "bg-emerald-100 text-emerald-700 border-emerald-200",
  rejected: "bg-rose-100 text-rose-700 border-rose-200",
};

const reviewStatusLabels: Record<ConsultantProgramVideo["review_status"], string> = {
  pending: "قيد المراجعة",
  approved: "معتمد",
  rejected: "مرفوض",
};

interface ConsultantVideoItemCardProps {
  video: ConsultantProgramVideo;
  programStatus: ProgramStatus;
  onDelete: (videoId: number) => Promise<void>;
  isDeleting?: boolean;
}

export function ConsultantVideoItemCard({
  video,
  programStatus,
  onDelete,
  isDeleting = false,
}: ConsultantVideoItemCardProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // The API contract has no per-video `can`, but explicitly forbids deleting an
  // approved video from an approved (published) program. Remove this local rule
  // once the backend exposes a proper `can.delete` per video.
  const deleteDisabled = programStatus === "approved" && video.review_status === "approved";

  return (
    <div className="space-y-2 rounded-lg border bg-muted/20 p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="space-y-1 text-right">
          <p className="font-semibold">{video.title_ar}</p>
          <p className="text-xs text-muted-foreground">الترتيب: #{video.order}</p>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`rounded-full border px-2.5 py-1 text-xs font-medium ${reviewStatusClasses[video.review_status]}`}
          >
            {reviewStatusLabels[video.review_status]}
          </span>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            disabled={deleteDisabled}
            onClick={() => setShowDeleteModal(true)}
          >
            <Trash2 className="ms-1 h-4 w-4" />
            حذف
          </Button>
        </div>
      </div>

      {video.review_status === "rejected" && video.rejection_reason && (
        <div className="flex items-start gap-2 rounded-lg border border-rose-200 bg-rose-50 p-2 text-xs text-rose-700">
          <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <span>{video.rejection_reason}</span>
        </div>
      )}

      <ConfirmationModal
        open={showDeleteModal}
        title="حذف الفيديو"
        description="هل أنت متأكد أنك تريد حذف هذا الفيديو؟ لا يمكن التراجع عن هذا الإجراء."
        confirmLabel="حذف"
        cancelLabel="إلغاء"
        isConfirming={isDeleting}
        onConfirm={async () => {
          await onDelete(video.id);
          setShowDeleteModal(false);
        }}
        onOpenChange={setShowDeleteModal}
      />
    </div>
  );
}
