"use client";

import { useState } from "react";
import { Link } from "@/i18n/navigation";
import { ArrowLeft, Clock3 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { ConfirmationModal } from "@/features/control-panel/users/ui/components/ConfirmationModal";
import { useReviewProgramDetail } from "../hooks/useReviewProgramDetail";
import { useReviewProgram } from "../hooks/useReviewProgram";
import { useReviewProgramVideo } from "../hooks/useReviewProgramVideo";
import { useProgramPurchases } from "../hooks/useProgramPurchases";
import { RejectReasonDialog } from "./components/RejectReasonDialog";
import { ReviewQueueDetailsPageSkeleton } from "./components/ReviewQueueDetailsPageSkeleton";
import type { ProgramPurchaseStatus, ReviewProgramVideoDetail } from "../types/review";

interface ReviewQueueDetailsPageProps {
  programId: string;
}

type PendingCourseAction = "approve" | "reject" | null;
type PendingVideoAction = { type: "approve" | "reject"; video: ReviewProgramVideoDetail } | null;

const videoStatusClasses: Record<ReviewProgramVideoDetail["review_status"], string> = {
  pending: "bg-amber-100 text-amber-700 border-amber-200",
  approved: "bg-emerald-100 text-emerald-700 border-emerald-200",
  rejected: "bg-rose-100 text-rose-700 border-rose-200",
};

const videoStatusLabels: Record<ReviewProgramVideoDetail["review_status"], string> = {
  pending: "قيد المراجعة",
  approved: "مقبول",
  rejected: "مرفوض",
};

const purchaseStatusClasses: Record<ProgramPurchaseStatus, string> = {
  completed: "bg-emerald-100 text-emerald-700 border-emerald-200",
  pending: "bg-amber-100 text-amber-700 border-amber-200",
  refunded: "bg-sky-100 text-sky-700 border-sky-200",
  failed: "bg-rose-100 text-rose-700 border-rose-200",
};

export function ReviewQueueDetailsPage({ programId }: ReviewQueueDetailsPageProps) {
  const numericProgramId = Number(programId);

  const { data: program, isLoading, isError } = useReviewProgramDetail(numericProgramId);
  const { mutateAsync: reviewCourse, isPending: isReviewingCourse } = useReviewProgram(numericProgramId);
  const { mutateAsync: reviewVideo, isPending: isReviewingVideo } = useReviewProgramVideo(numericProgramId);
  const { data: purchases, isLoading: isLoadingPurchases, isError: isPurchasesError } =
    useProgramPurchases(numericProgramId);

  const [pendingCourseAction, setPendingCourseAction] = useState<PendingCourseAction>(null);
  const [pendingVideoAction, setPendingVideoAction] = useState<PendingVideoAction>(null);

  const closeCourseAction = () => setPendingCourseAction(null);
  const closeVideoAction = () => setPendingVideoAction(null);

  const handleApproveCourse = async () => {
    if (isReviewingCourse) return;
    await reviewCourse({ action: "approve" });
    closeCourseAction();
  };

  const handleRejectCourse = async (reason: string) => {
    if (isReviewingCourse) return;
    await reviewCourse({ action: "reject", rejection_reason: reason });
    closeCourseAction();
  };

  const handleApproveVideo = async () => {
    if (!pendingVideoAction || isReviewingVideo) return;
    await reviewVideo({
      programId: numericProgramId,
      videoId: pendingVideoAction.video.id,
      payload: { action: "approve" },
    });
    closeVideoAction();
  };

  const handleRejectVideo = async (reason: string) => {
    if (!pendingVideoAction || isReviewingVideo) return;
    await reviewVideo({
      programId: numericProgramId,
      videoId: pendingVideoAction.video.id,
      payload: { action: "reject", rejection_reason: reason },
    });
    closeVideoAction();
  };

  if (isLoading) {
    return <ReviewQueueDetailsPageSkeleton />;
  }

  if (isError || !program) {
    return (
      <div className="mx-auto w-full max-w-7xl p-6" dir="rtl">
        <Card>
          <CardContent className="space-y-3 pt-6 text-center">
            <p className="font-medium text-destructive">تعذر تحميل بيانات الكورس، أو أنه لم يعد بانتظار المراجعة.</p>
            <Button asChild variant="outline">
              <Link href="/control-panel/programs/review-queue">العودة إلى قائمة المراجعة</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl space-y-5 p-6" dir="rtl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">مراجعة الكورس</h1>
          <p className="text-sm text-muted-foreground">راجعي بيانات الكورس وفيديوهاته قبل اتخاذ القرار.</p>
        </div>
        <Button asChild variant="outline" className="gap-2">
          <Link href="/control-panel/programs/review-queue">
            <ArrowLeft className="h-4 w-4" />
            رجوع
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-right">معلومات الكورس</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-semibold">{program.title}</h2>
            {program.submission_number > 1 && (
              <Badge variant="outline" className="border-amber-200 bg-amber-100 text-amber-700">
                أُعيد الإرسال (المحاولة {program.submission_number})
              </Badge>
            )}
          </div>

          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg border bg-muted/20 p-3">
              <p className="text-xs text-muted-foreground">المنشئ</p>
              <p className="font-medium">{program.creator.full_name}</p>
            </div>
            <div className="rounded-lg border bg-muted/20 p-3">
              <p className="text-xs text-muted-foreground">السعر</p>
              <p className="font-medium">{program.price} {program.currency}</p>
            </div>
            <div className="rounded-lg border bg-muted/20 p-3">
              <p className="text-xs text-muted-foreground">عدد الفيديوهات</p>
              <p className="font-medium">{program.videos.length}</p>
            </div>
            <div className="rounded-lg border bg-muted/20 p-3">
              <p className="text-xs text-muted-foreground">تاريخ الإرسال</p>
              <p className="font-medium">{new Date(program.submitted_at).toLocaleDateString("ar")}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button onClick={() => setPendingCourseAction("approve")}>قبول الكورس</Button>
            <Button variant="destructive" onClick={() => setPendingCourseAction("reject")}>
              رفض الكورس
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="videos" dir="rtl">
        <TabsList>
          <TabsTrigger value="videos">الفيديوهات</TabsTrigger>
          <TabsTrigger value="purchases">عمليات الشراء</TabsTrigger>
        </TabsList>

        <TabsContent value="videos">
          <Card>
            <CardHeader>
              <CardTitle className="text-right">قائمة الفيديوهات</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {program.videos.length === 0 ? (
                <p className="text-sm text-muted-foreground">لا توجد فيديوهات مرتبطة بهذا الكورس.</p>
              ) : (
                program.videos.map((video) => (
                  <div
                    key={video.id}
                    className="flex flex-wrap items-start justify-between gap-3 rounded-lg border p-3"
                  >
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-medium">{video.title}</p>
                        {video.is_program_intro && <Badge variant="secondary">فيديو تعريفي</Badge>}
                        <Badge variant="outline" className={cn(videoStatusClasses[video.review_status])}>
                          {videoStatusLabels[video.review_status]}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1">
                          <Clock3 className="h-3.5 w-3.5" />
                          {video.duration_minute ?? "-"} دقيقة
                        </span>
                      </div>
                      {video.review_status === "rejected" && video.rejection_reason && (
                        <p className="text-xs text-rose-600">سبب الرفض: {video.rejection_reason}</p>
                      )}
                    </div>

                    {video.review_status === "pending" && (
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          onClick={() => setPendingVideoAction({ type: "approve", video })}
                        >
                          قبول
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => setPendingVideoAction({ type: "reject", video })}
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
        </TabsContent>

        <TabsContent value="purchases">
          <Card>
            <CardHeader>
              <CardTitle className="text-right">عمليات الشراء</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingPurchases && (
                <>
                  {/* Mobile: stacked cards */}
                  <div className="space-y-3 md:hidden">
                    {Array.from({ length: 3 }).map((_, index) => (
                      <div key={`purchase-card-skeleton-${index}`} className="space-y-2 rounded-xl border p-3">
                        <Skeleton className="h-4 w-28" />
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-6 w-16 rounded-full" />
                      </div>
                    ))}
                  </div>
                  {/* Desktop/tablet: table */}
                  <div className="hidden overflow-x-auto rounded-xl border bg-white md:block">
                    <table className="w-full text-right text-sm">
                      <thead className="bg-muted/40 text-muted-foreground">
                        <tr>
                          <th className="px-4 py-3 font-medium">المريض</th>
                          <th className="px-4 py-3 font-medium">المبلغ</th>
                          <th className="px-4 py-3 font-medium">الحالة</th>
                          <th className="px-4 py-3 font-medium">تاريخ الشراء</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Array.from({ length: 3 }).map((_, index) => (
                          <tr key={`purchase-row-skeleton-${index}`} className="border-t align-middle">
                            <td className="px-4 py-3"><Skeleton className="h-4 w-28" /></td>
                            <td className="px-4 py-3"><Skeleton className="h-4 w-20" /></td>
                            <td className="px-4 py-3"><Skeleton className="h-6 w-16 rounded-full" /></td>
                            <td className="px-4 py-3"><Skeleton className="h-4 w-24" /></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}

              {!isLoadingPurchases && isPurchasesError && (
                <div className="rounded-xl border bg-white px-4 py-10 text-center text-destructive">
                  تعذر تحميل عمليات الشراء.
                </div>
              )}

              {!isLoadingPurchases && !isPurchasesError && (purchases?.length ?? 0) === 0 && (
                <div className="rounded-xl border bg-white px-4 py-10 text-center text-muted-foreground">
                  لا توجد عمليات شراء لهذا الكورس بعد.
                </div>
              )}

              {!isLoadingPurchases && !isPurchasesError && (purchases?.length ?? 0) > 0 && (
                <>
                  {/* Mobile: stacked cards instead of a horizontally-scrolling table */}
                  <div className="space-y-3 md:hidden">
                    {purchases?.map((purchase) => (
                      <div key={purchase.id} className="space-y-2 rounded-xl border bg-white p-3">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-medium">{purchase.patient_name}</span>
                          <Badge variant="outline" className={cn(purchaseStatusClasses[purchase.status])}>
                            {purchase.status_label}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between gap-2 text-sm text-muted-foreground">
                          <span className="font-medium tabular-nums text-foreground">
                            {purchase.amount} <span className="text-xs text-muted-foreground">{purchase.currency}</span>
                          </span>
                          <span>{new Date(purchase.purchased_at).toLocaleDateString("ar")}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Desktop/tablet: regular table */}
                  <div className="hidden overflow-x-auto rounded-xl border bg-white md:block">
                    <table className="w-full text-right text-sm">
                      <thead className="bg-muted/40 text-muted-foreground">
                        <tr>
                          <th className="px-4 py-3 font-medium">المريض</th>
                          <th className="px-4 py-3 font-medium">المبلغ</th>
                          <th className="px-4 py-3 font-medium">الحالة</th>
                          <th className="px-4 py-3 font-medium">تاريخ الشراء</th>
                        </tr>
                      </thead>
                      <tbody>
                        {purchases?.map((purchase) => (
                          <tr key={purchase.id} className="border-t align-middle">
                            <td className="px-4 py-3">{purchase.patient_name}</td>
                            <td className="px-4 py-3 font-medium tabular-nums">
                              {purchase.amount} <span className="text-xs text-muted-foreground">{purchase.currency}</span>
                            </td>
                            <td className="px-4 py-3">
                              <Badge variant="outline" className={cn(purchaseStatusClasses[purchase.status])}>
                                {purchase.status_label}
                              </Badge>
                            </td>
                            <td className="px-4 py-3 text-muted-foreground">
                              {new Date(purchase.purchased_at).toLocaleDateString("ar")}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <ConfirmationModal
        open={pendingCourseAction === "approve"}
        title="قبول الكورس"
        description="هل أنت متأكدة أنك تريدين قبول هذا الكورس؟"
        confirmLabel="قبول"
        cancelLabel="إلغاء"
        onConfirm={handleApproveCourse}
        onOpenChange={(open) => !open && closeCourseAction()}
        isConfirming={isReviewingCourse}
      />

      <RejectReasonDialog
        open={pendingCourseAction === "reject"}
        title="رفض الكورس"
        isSubmitting={isReviewingCourse}
        onOpenChange={(open) => !open && closeCourseAction()}
        onConfirm={handleRejectCourse}
      />

      <ConfirmationModal
        open={pendingVideoAction?.type === "approve"}
        title="قبول الفيديو"
        description="هل أنت متأكدة أنك تريدين قبول هذا الفيديو؟"
        confirmLabel="قبول"
        cancelLabel="إلغاء"
        onConfirm={handleApproveVideo}
        onOpenChange={(open) => !open && closeVideoAction()}
        isConfirming={isReviewingVideo}
      />

      <RejectReasonDialog
        open={pendingVideoAction?.type === "reject"}
        title="رفض الفيديو"
        isSubmitting={isReviewingVideo}
        onOpenChange={(open) => !open && closeVideoAction()}
        onConfirm={handleRejectVideo}
      />
    </div>
  );
}
