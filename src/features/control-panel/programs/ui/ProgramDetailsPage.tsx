"use client";

import { useMemo, useState } from "react";
import { Link } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, Clock3, PlayCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { ConfirmationModal } from "@/features/control-panel/users/ui/components/ConfirmationModal";
import { useProgramDetails } from "../hooks/useProgramDetails";
import { useProgramReviewActions } from "../hooks/useProgramReviewActions";
import { SignedVideoPlayer } from "@/features/programs/ui/shared/SignedVideoPlayer";
import { RejectReasonDialog } from "./components/RejectReasonDialog";
import type { ControlPanelProgramVideo, VideoReviewStatus } from "../types/program";

interface ProgramDetailsPageProps {
  programId: string;
}

type PendingAction =
  | { type: "approve-program" }
  | { type: "reject-program" }
  | { type: "approve-video"; video: ControlPanelProgramVideo }
  | { type: "reject-video"; video: ControlPanelProgramVideo }
  | null;

const statusLabel = {
  draft: "مسودة",
  pending: "قيد المراجعة",
  approved: "موافق عليه",
  rejected: "مرفوض",
  published: "منشور",
  archived: "مؤرشف",
};

const reviewStatusLabel: Record<VideoReviewStatus, string> = {
  pending: "قيد المراجعة",
  approved: "موافق عليه",
  rejected: "مرفوض",
};

const reviewStatusClasses: Record<VideoReviewStatus, string> = {
  pending: "bg-violet-100 text-violet-700 border-violet-200",
  approved: "bg-emerald-100 text-emerald-700 border-emerald-200",
  rejected: "bg-rose-100 text-rose-700 border-rose-200",
};

export function ProgramDetailsPage({ programId }: ProgramDetailsPageProps) {
  const numericProgramId = Number(programId);
  const searchParams = useSearchParams();
  const { data: program, isLoading, isError } = useProgramDetails(programId);
  const { approveProgramMutation, rejectProgramMutation, approveVideoMutation, rejectVideoMutation } =
    useProgramReviewActions(numericProgramId);

  const initialVideoId = Number(searchParams.get("video")) || null;
  const [activeVideoId, setActiveVideoId] = useState<number | null>(initialVideoId);
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);

  const activeVideo = useMemo(() => {
    if (!program?.videos.length) {
      return null;
    }

    const selectedVideo = program.videos.find((video) => video.id === activeVideoId);
    return selectedVideo ?? program.videos[0];
  }, [activeVideoId, program?.videos]);

  const closeAction = () => setPendingAction(null);

  const isReviewingProgram = approveProgramMutation.isPending || rejectProgramMutation.isPending;
  const isReviewingVideo = approveVideoMutation.isPending || rejectVideoMutation.isPending;

  // Each handler closes the dialog only on success, so a backend error (e.g. 422 "already
  // reviewed") leaves it open and the toast shows the backend message.
  const handleApproveProgram = async () => {
    if (isReviewingProgram) return;
    try {
      await approveProgramMutation.mutateAsync();
      closeAction();
    } catch {
      /* handled in the hook */
    }
  };

  const handleRejectProgram = async (reason: string) => {
    if (isReviewingProgram) return;
    try {
      await rejectProgramMutation.mutateAsync(reason);
      closeAction();
    } catch {
      /* handled in the hook */
    }
  };

  const handleApproveVideo = async () => {
    if (pendingAction?.type !== "approve-video" || isReviewingVideo) return;
    try {
      await approveVideoMutation.mutateAsync(pendingAction.video.id);
      closeAction();
    } catch {
      /* handled in the hook */
    }
  };

  const handleRejectVideo = async (reason: string) => {
    if (pendingAction?.type !== "reject-video" || isReviewingVideo) return;
    try {
      await rejectVideoMutation.mutateAsync({ videoId: pendingAction.video.id, reason });
      closeAction();
    } catch {
      /* handled in the hook */
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-7xl space-y-4 p-6" dir="rtl">
        <Skeleton className="h-10 w-44" />
        <Skeleton className="h-56 w-full" />
        <Skeleton className="h-80 w-full" />
      </div>
    );
  }

  if (isError || !program) {
    return (
      <div className="mx-auto w-full max-w-7xl p-6" dir="rtl">
        <Card>
          <CardContent className="space-y-3 pt-6 text-center">
            <p className="font-medium text-destructive">تعذر تحميل بيانات البرنامج.</p>
            <Button asChild variant="outline">
              <Link href="/control-panel/programs">العودة إلى البرامج</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isProgramPending = program.status === "pending";

  return (
    <div className="mx-auto w-full max-w-7xl space-y-5 p-6" dir="rtl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1 text-right">
          <h1 className="text-2xl font-semibold">تفاصيل البرنامج</h1>
          <p className="text-sm text-muted-foreground">مراجعة بيانات البرنامج والفيديوهات المرتبطة به.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {isProgramPending && (
            <>
              <Button onClick={() => setPendingAction({ type: "approve-program" })}>قبول البرنامج</Button>
              <Button variant="destructive" onClick={() => setPendingAction({ type: "reject-program" })}>
                رفض البرنامج
              </Button>
            </>
          )}
          <Button asChild variant="outline" className="gap-2">
            <Link href="/control-panel/programs">
              <ArrowLeft className="h-4 w-4" />
              رجوع
            </Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-right">معلومات البرنامج</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-semibold">{program.title}</h2>
            <div className="flex flex-wrap items-center gap-2">
              {program.submissionCount > 1 && (
                <Badge variant="outline" className="border-amber-200 bg-amber-100 text-amber-700">
                  أُعيد إرساله
                </Badge>
              )}
              <Badge
                variant="outline"
                className={cn(program.status === "pending" && "border-violet-200 bg-violet-100 text-violet-700")}
              >
                {statusLabel[program.status]}
              </Badge>
            </div>
          </div>
          {program.status === "rejected" && program.rejectionReason && (
            <p className="text-sm text-rose-600">سبب الرفض: {program.rejectionReason}</p>
          )}
          <p className="text-sm leading-7 text-muted-foreground">{program.description}</p>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg border bg-muted/20 p-3"><p className="text-xs text-muted-foreground">المنشئ</p><p className="font-medium">{program.creator}</p></div>
            <div className="rounded-lg border bg-muted/20 p-3"><p className="text-xs text-muted-foreground">السعر</p><p className="font-medium">{program.price ?? "-"}</p></div>
            <div className="rounded-lg border bg-muted/20 p-3"><p className="text-xs text-muted-foreground">العملة</p><p className="font-medium">{program.currency ?? "-"}</p></div>
            <div className="rounded-lg border bg-muted/20 p-3"><p className="text-xs text-muted-foreground">عدد الفيديوهات</p><p className="font-medium">{program.videos.length}</p></div>
          </div>
          <div className="rounded-lg border bg-muted/20 p-3">
            <p className="text-xs text-muted-foreground">ماذا ستتعلم</p>
            <p className="mt-1 text-sm text-foreground">{program.whatYouWillLearn}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-right">قائمة الفيديوهات</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {activeVideo && (
            <div className="space-y-3 rounded-lg border bg-muted/20 p-3">
              <p className="text-sm font-medium text-right">{activeVideo.title}</p>
              <SignedVideoPlayer
                programId={numericProgramId}
                videoId={activeVideo.id}
                poster={program.coverImage}
                className="w-full aspect-video rounded-lg bg-black"
              />
            </div>
          )}

          {program.videos.length === 0 ? (
            <p className="text-sm text-muted-foreground">لا توجد فيديوهات مرتبطة بهذا البرنامج.</p>
          ) : (
            program.videos.map((video) => (
              <div
                key={video.id}
                className={cn(
                  "flex flex-wrap items-start justify-between gap-3 rounded-lg border p-3",
                  video.id === activeVideo?.id && "border-primary/50 bg-muted/30",
                )}
              >
                <button
                  type="button"
                  onClick={() => setActiveVideoId(video.id)}
                  className="flex min-w-0 flex-1 cursor-pointer items-start gap-3 text-right"
                >
                  <PlayCircle className="mt-1 h-5 w-5 shrink-0 text-muted-foreground" />
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium">{video.order ? `#${video.order} - ` : ""}{video.title}</p>
                      {video.reviewStatus && (
                        <Badge variant="outline" className={cn(reviewStatusClasses[video.reviewStatus])}>
                          {reviewStatusLabel[video.reviewStatus]}
                        </Badge>
                      )}
                      {video.isProgramIntro && <Badge variant="secondary">فيديو تعريفي</Badge>}
                      {video.isFree && <Badge variant="secondary">مجاني</Badge>}
                    </div>
                    {video.description && video.description !== "-" && (
                      <p className="text-sm text-muted-foreground">{video.description}</p>
                    )}
                    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock3 className="h-3.5 w-3.5" />
                      {video.durationMinute ?? "-"} دقيقة
                    </span>
                    {video.reviewStatus === "rejected" && video.rejectionReason && (
                      <p className="text-xs text-rose-600">سبب الرفض: {video.rejectionReason}</p>
                    )}
                  </div>
                </button>

                {video.reviewStatus === "pending" && (
                  <div className="flex items-center gap-2">
                    <Button size="sm" onClick={() => setPendingAction({ type: "approve-video", video })}>
                      قبول
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => setPendingAction({ type: "reject-video", video })}
                    >
                      رفض
                    </Button>
                  </div>
                )}
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <ConfirmationModal
        open={pendingAction?.type === "approve-program"}
        title="قبول البرنامج"
        description="هل أنت متأكدة أنك تريدين قبول هذا البرنامج؟"
        confirmLabel="قبول"
        cancelLabel="إلغاء"
        onConfirm={handleApproveProgram}
        onOpenChange={(open) => !open && closeAction()}
        isConfirming={isReviewingProgram}
      />

      <RejectReasonDialog
        open={pendingAction?.type === "reject-program"}
        title="رفض البرنامج"
        isSubmitting={isReviewingProgram}
        onOpenChange={(open) => !open && closeAction()}
        onConfirm={handleRejectProgram}
      />

      <ConfirmationModal
        open={pendingAction?.type === "approve-video"}
        title="قبول الفيديو"
        description="هل أنت متأكدة أنك تريدين قبول هذا الفيديو؟"
        confirmLabel="قبول"
        cancelLabel="إلغاء"
        onConfirm={handleApproveVideo}
        onOpenChange={(open) => !open && closeAction()}
        isConfirming={isReviewingVideo}
      />

      <RejectReasonDialog
        open={pendingAction?.type === "reject-video"}
        title="رفض الفيديو"
        isSubmitting={isReviewingVideo}
        onOpenChange={(open) => !open && closeAction()}
        onConfirm={handleRejectVideo}
      />
    </div>
  );
}
