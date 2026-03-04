"use client";

import { useEffect, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Pencil } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { ConfirmationModal } from "@/features/control-panel/users/ui/components/ConfirmationModal";
import { newVideosSchema, type NewVideosFormValues } from "../../types/create-program-form";
import type { ControlPanelProgramVideo } from "../../types/program";
import { useProgramVideoDetails } from "../../hooks/useProgramVideoDetails";
import { VideoFormSection } from "./VideoFormSection";

interface VideoItemCardProps {
  video: ControlPanelProgramVideo;
  onUpdate: (videoId: number, values: NewVideosFormValues["videos"][number]) => Promise<void>;
  onDelete: (videoId: number) => Promise<void>;
  isUpdating: boolean;
  isDeleting: boolean;
}

export function VideoItemCard({ video, onUpdate, onDelete, isUpdating, isDeleting }: VideoItemCardProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { data: details, isFetching } = useProgramVideoDetails(isEditing ? video.id : null);

  const initialVideoValues = useMemo(
    () => ({
      title_ar: video.titleAr || video.title,
      description_ar: video.descriptionAr || video.description,
      duration_minute: video.durationMinute ?? 1,
      order: video.order ?? 1,
      is_program_intro: video.isProgramIntro,
      is_free: video.isFree,
      video_path: undefined,
    }),
    [video],
  );

  const form = useForm<NewVideosFormValues>({
    resolver: zodResolver(newVideosSchema),
    defaultValues: {
      videos: [initialVideoValues],
    },
  });

  useEffect(() => {
    if (!isEditing) {
      return;
    }

    if (!details) {
      form.reset({ videos: [initialVideoValues] });
      return;
    }

    form.reset({
      videos: [
        {
          title_ar: details.title_ar ?? initialVideoValues.title_ar,
          description_ar: details.description_ar ?? initialVideoValues.description_ar,
          duration_minute: details.duration_minute ?? initialVideoValues.duration_minute,
          order: details.order ?? initialVideoValues.order,
          is_program_intro: Boolean(details.is_program_intro),
          is_free: Boolean(details.is_free),
          video_path: undefined,
        },
      ],
    });
  }, [details, form, initialVideoValues, isEditing]);

  const handleUpdate = form.handleSubmit(async (values) => {
    await onUpdate(video.id, values.videos[0]);
    setIsEditing(false);
  });

  const handleToggleEdit = () => {
    setIsEditing((prev) => !prev);
  };

  return (
    <div className="space-y-3 rounded-lg border bg-muted/20 p-3">
      <div className="flex items-center justify-between border-b pb-2">
        <div className="space-y-1 text-right">
          <p className="font-semibold">{video.title}</p>
          <p className="text-xs text-muted-foreground">الترتيب: #{video.order ?? "-"}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button type="button" variant="outline" size="sm" onClick={handleToggleEdit}>
            <Pencil className="ml-1 h-4 w-4" />
            {isEditing ? "إغلاق التعديل" : "تعديل"}
          </Button>
          <Button type="button" variant="destructive" size="sm" onClick={() => setShowDeleteModal(true)}>
            حذف
          </Button>
        </div>
      </div>

      {isEditing ? (
        <Form {...form}>
          <form onSubmit={handleUpdate} className="space-y-3">
            {isFetching ? (
              <div className="flex items-center justify-center p-4 text-sm text-muted-foreground">
                <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                جاري تحميل بيانات الفيديو...
              </div>
            ) : (
              <VideoFormSection
                index={0}
                form={form}
                basePath="videos.0"
                canRemove={false}
                onRemove={() => undefined}
                title="تعديل بيانات الفيديو"
              />
            )}
            <div className="flex justify-end">
              <Button type="submit" disabled={isUpdating || isFetching}>
                {isUpdating ? "جارٍ الحفظ..." : "حفظ التعديلات"}
              </Button>
            </div>
          </form>
        </Form>
      ) : null}

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
