"use client";

import { useState } from "react";
import { AlertTriangle, Loader2, Pencil, Trash2 } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ConfirmationModal } from "@/features/control-panel/users/ui/components/ConfirmationModal";
import {
  consultantVideoEditSchema,
  type ConsultantVideoEditFormValues,
} from "../../types/consultant-program-form";
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
  onUpdate: (videoId: number, values: ConsultantVideoEditFormValues) => Promise<void>;
  isDeleting?: boolean;
  isUpdating?: boolean;
}

export function ConsultantVideoItemCard({
  video,
  programStatus,
  onDelete,
  onUpdate,
  isDeleting = false,
  isUpdating = false,
}: ConsultantVideoItemCardProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // An archived course is fully locked — no video add/edit/delete at all, confirmed by
  // backend (422 if attempted). The API contract has no per-video `can`, but also
  // explicitly forbids deleting an approved video from an approved (published) program.
  // Remove this local rule once the backend exposes a proper `can.delete` per video.
  const isArchived = programStatus === "archived";
  const deleteDisabled =
    isArchived || (programStatus === "approved" && video.review_status === "approved");

  // Editing is blocked while a video is awaiting admin review ("pending") or already
  // approved (replacing an approved file without a new review isn't allowed). A
  // rejected video can always be fixed, and any video inside a still-draft program
  // can be edited freely — it hasn't been submitted for review yet, so there's no
  // in-flight review to invalidate. Archived always wins over all of that.
  const canEditVideo =
    !isArchived && (video.review_status === "rejected" || programStatus === "draft");

  const form = useForm<ConsultantVideoEditFormValues>({
    resolver: zodResolver(consultantVideoEditSchema),
    defaultValues: {
      title_ar: video.title_ar,
      title_en: video.title_en,
      order: video.order,
      duration_minute: video.duration_minute ?? 0,
      is_program_intro: video.is_program_intro,
      is_free: video.is_free,
    },
  });

  const openEditForm = () => {
    form.reset({
      title_ar: video.title_ar,
      title_en: video.title_en,
      order: video.order,
      duration_minute: video.duration_minute ?? 0,
      is_program_intro: video.is_program_intro,
      is_free: video.is_free,
    });
    setIsEditing(true);
  };

  const submitEdit = form.handleSubmit(async (values) => {
    if (isUpdating) return;
    await onUpdate(video.id, values);
    setIsEditing(false);
  });

  return (
    <div className="space-y-2 rounded-lg border bg-muted/20 p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="space-y-1 text-right">
          <p className="font-semibold">{video.title_ar}</p>
          <p className="text-xs text-muted-foreground">
            الترتيب: #{video.order}
            {" · "}
            المدة:{" "}
            {video.duration_minute ? (
              `${video.duration_minute} دقيقة`
            ) : (
              <span className="font-medium text-destructive">غير محددة</span>
            )}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`rounded-full border px-2.5 py-1 text-xs font-medium ${reviewStatusClasses[video.review_status]}`}
          >
            {reviewStatusLabels[video.review_status]}
          </span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={!canEditVideo}
            title={!canEditVideo ? "لا يمكن تعديل الفيديو أثناء انتظار المراجعة أو بعد اعتماده" : undefined}
            onClick={() => (isEditing ? setIsEditing(false) : openEditForm())}
          >
            <Pencil className="ms-1 h-4 w-4" />
            {isEditing ? "إلغاء التعديل" : "تعديل"}
          </Button>
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

      {isEditing && (
        <Form {...form}>
          <form onSubmit={submitEdit} className="grid gap-4 rounded-lg border bg-background p-3 md:grid-cols-2">
            <FormField
              control={form.control}
              name="title_ar"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>عنوان الفيديو (عربي)</FormLabel>
                  <FormControl>
                    <Input {...field} dir="rtl" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="title_en"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>عنوان الفيديو (إنجليزي)</FormLabel>
                  <FormControl>
                    <Input {...field} dir="ltr" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="order"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ترتيب الفيديو</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      value={field.value}
                      onChange={(event) => field.onChange(Number(event.target.value))}
                      className="no-spinner"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="duration_minute"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>مدة الفيديو (بالدقائق)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      value={field.value ? field.value : ""}
                      onChange={(event) =>
                        field.onChange(
                          event.target.value === "" ? undefined : Number(event.target.value),
                        )
                      }
                      className="no-spinner"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="is_program_intro"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center gap-2 space-y-0 rounded-lg border p-3">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(checked) => field.onChange(Boolean(checked))}
                    />
                  </FormControl>
                  <FormLabel className="mb-0 cursor-pointer">فيديو مقدمة البرنامج</FormLabel>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="is_free"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center gap-2 space-y-0 rounded-lg border p-3">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(checked) => field.onChange(Boolean(checked))}
                    />
                  </FormControl>
                  <FormLabel className="mb-0 cursor-pointer">فيديو مجاني</FormLabel>
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 md:col-span-2">
              <Button type="button" variant="outline" onClick={() => setIsEditing(false)} disabled={isUpdating}>
                إلغاء
              </Button>
              <Button type="submit" className="min-w-28" disabled={isUpdating}>
                {isUpdating && <Loader2 className="h-4 w-4 animate-spin" />}
                {isUpdating ? "جارٍ الحفظ..." : "حفظ التعديل"}
              </Button>
            </div>
          </form>
        </Form>
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
