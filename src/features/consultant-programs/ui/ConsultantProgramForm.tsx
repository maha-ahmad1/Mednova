"use client";

import { useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Send } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { ProfileImageUpload } from "@/shared/ui/forms";
import { useAddConsultantProgramVideo } from "../hooks/useAddConsultantProgramVideo";
import { useCreateConsultantProgram } from "../hooks/useCreateConsultantProgram";
import { useDeleteConsultantProgramVideo } from "../hooks/useDeleteConsultantProgramVideo";
import { useSubmitConsultantProgramForReview } from "../hooks/useSubmitConsultantProgramForReview";
import { useUpdateConsultantProgram } from "../hooks/useUpdateConsultantProgram";
import {
  consultantProgramSchema,
  createDefaultConsultantVideo,
  newConsultantVideosSchema,
  type ConsultantProgramFormValues,
  type NewConsultantVideosFormValues,
} from "../types/consultant-program-form";
import type { ConsultantProgram } from "../types/consultant-program";
import { ConsultantProgramSales } from "./components/ConsultantProgramSales";
import { ConsultantProgramStatusBadge } from "./components/ConsultantProgramStatusBadge";
import { ConsultantVideoFormSection } from "./components/ConsultantVideoFormSection";
import { ConsultantVideoItemCard } from "./components/ConsultantVideoItemCard";

interface ConsultantProgramFormProps {
  mode: "create" | "edit";
  program?: ConsultantProgram;
}

export function ConsultantProgramForm({ mode, program }: ConsultantProgramFormProps) {
  const isCreateMode = mode === "create";
  // A program the specialist can't edit (approved/pending/archived) is still
  // shown, read-only, instead of hiding the page — they must be able to see
  // their published course even if they can't change it.
  const isReadOnly = !isCreateMode && !program?.can.edit;

  const { createProgram, isLoading: isCreating } = useCreateConsultantProgram();
  const { updateProgram, isLoading: isUpdating } = useUpdateConsultantProgram(program?.id ?? 0);
  const { submitForReview, isLoading: isSubmitting } = useSubmitConsultantProgramForReview(
    program?.id ?? 0,
  );
  const { deleteVideo, isLoading: isDeletingVideo } = useDeleteConsultantProgramVideo(
    program?.id ?? 0,
  );
  const { addVideo, progressByTempId, isUploading } = useAddConsultantProgramVideo(
    program?.id ?? 0,
  );

  const [isAddVideoFormOpen, setIsAddVideoFormOpen] = useState(false);

  const form = useForm<ConsultantProgramFormValues>({
    resolver: zodResolver(consultantProgramSchema),
    defaultValues: {
      title_ar: program?.title_ar ?? "",
      title_en: program?.title_en ?? "",
      description_ar: program?.description_ar ?? "",
      description_en: program?.description_en ?? "",
      what_you_will_learn_ar: program?.what_you_will_learn_ar ?? "",
      what_you_will_learn_en: program?.what_you_will_learn_en ?? "",
      price: program ? Number(program.price) : 0,
      cover_image: undefined,
    },
    mode: "onSubmit",
  });

  const addVideoForm = useForm<NewConsultantVideosFormValues>({
    resolver: zodResolver(newConsultantVideosSchema),
    defaultValues: { videos: [createDefaultConsultantVideo((program?.videos.length ?? 0) + 1)] },
  });

  const addVideoFieldArray = useFieldArray({ control: addVideoForm.control, name: "videos" });

  const sortedVideos = useMemo(
    () => [...(program?.videos ?? [])].sort((a, b) => a.order - b.order),
    [program?.videos],
  );

  const submitProgram = form.handleSubmit(async (values) => {
    if (isCreateMode) {
      await createProgram({
        title_ar: values.title_ar,
        title_en: values.title_en,
        description_ar: values.description_ar,
        description_en: values.description_en,
        what_you_will_learn_ar: values.what_you_will_learn_ar,
        what_you_will_learn_en: values.what_you_will_learn_en,
        price: values.price,
        cover_image: values.cover_image as File | undefined,
      });
      return;
    }

    await updateProgram({
      title_ar: values.title_ar,
      title_en: values.title_en,
      description_ar: values.description_ar,
      description_en: values.description_en,
      what_you_will_learn_ar: values.what_you_will_learn_ar,
      what_you_will_learn_en: values.what_you_will_learn_en,
      price: values.price,
      cover_image: values.cover_image as File | undefined,
    });
  });

  const submitAddVideos = addVideoForm.handleSubmit(async (values) => {
    for (const video of values.videos) {
      const tempId = `${Date.now()}-${Math.random()}`;
      await addVideo(tempId, {
        title_ar: video.title_ar,
        title_en: video.title_en,
        order: video.order,
        is_program_intro: video.is_program_intro,
        is_free: video.is_free,
        video: video.video as File,
      });
    }

    addVideoForm.reset({
      videos: [createDefaultConsultantVideo((program?.videos.length ?? 0) + 1)],
    });
    setIsAddVideoFormOpen(false);
  });

  const isSubmittingProgram = isCreateMode ? isCreating : isUpdating;

  return (
    <div className="space-y-5">
      {!isCreateMode && program && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-white p-4">
          <div className="flex items-center gap-3">
            <ConsultantProgramStatusBadge status={program.status} label={program.status_label} />
            {isReadOnly && (
              <span className="text-sm text-muted-foreground">
                لا يمكن تعديل بيانات الكورس بحالته الحالية — معروضة للقراءة فقط.
              </span>
            )}
          </div>

          {program.can.submit && (
            <Button
              type="button"
              onClick={() => submitForReview()}
              disabled={isSubmitting || isUploading}
              title={isUploading ? "لا يمكن الإرسال أثناء رفع فيديو" : undefined}
            >
              <Send className="ms-1 h-4 w-4" />
              {isSubmitting ? "جارٍ الإرسال..." : "إرسال للمراجعة"}
            </Button>
          )}
        </div>
      )}

      <Form {...form}>
        <fieldset disabled={isReadOnly} className="space-y-5">
          <form onSubmit={submitProgram} className="space-y-5">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">معلومات الكورس</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="title_ar"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>عنوان الكورس (عربي)</FormLabel>
                      <FormControl>
                        <Input placeholder="أدخل عنوان الكورس" {...field} dir="rtl" />
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
                      <FormLabel>عنوان الكورس (إنجليزي)</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter course title" {...field} dir="ltr" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>السعر (OMR)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
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
                  name="description_ar"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>وصف الكورس (عربي)</FormLabel>
                      <FormControl>
                        <Textarea rows={4} placeholder="اكتب وصف الكورس" {...field} dir="rtl" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description_en"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>وصف الكورس (إنجليزي)</FormLabel>
                      <FormControl>
                        <Textarea rows={4} placeholder="Write the course description" {...field} dir="ltr" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="what_you_will_learn_ar"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ماذا سيتعلم المستخدم (عربي)</FormLabel>
                      <FormControl>
                        <Textarea rows={4} placeholder="اكتب مخرجات التعلم" {...field} dir="rtl" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="what_you_will_learn_en"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ماذا سيتعلم المستخدم (إنجليزي)</FormLabel>
                      <FormControl>
                        <Textarea rows={4} placeholder="Write the learning outcomes" {...field} dir="ltr" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cover_image"
                  render={({ field: { onChange, value, ...field } }) => (
                    <FormItem className="md:col-span-2">
                      <FormControl>
                        <ProfileImageUpload
                          label="صورة الغلاف"
                          value={(value as File | null) ?? program?.cover_image ?? null}
                          onChange={(file) => onChange(file)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {!isReadOnly && (
              <div className="flex justify-end rounded-lg border bg-background/95 p-3 backdrop-blur">
                <Button type="submit" disabled={isSubmittingProgram}>
                  {isSubmittingProgram
                    ? isCreateMode
                      ? "جاري الإنشاء..."
                      : "جاري التحديث..."
                    : isCreateMode
                      ? "إنشاء الكورس"
                      : "تحديث الكورس"}
                </Button>
              </div>
            )}
          </form>
        </fieldset>
      </Form>

      {!isCreateMode && program && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div className="space-y-1">
              <CardTitle className="text-lg">إدارة فيديوهات الكورس</CardTitle>
              <p className="text-sm text-muted-foreground">
                {program.videos.length} فيديو مضاف حاليًا.
              </p>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {sortedVideos.length === 0 ? (
              <div className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
                لا توجد فيديوهات حالية لهذا الكورس حتى الآن.
              </div>
            ) : (
              sortedVideos.map((video) => (
                <ConsultantVideoItemCard
                  key={video.id}
                  video={video}
                  programStatus={program.status}
                  isDeleting={isDeletingVideo}
                  onDelete={async (videoId) => {
                    await deleteVideo(videoId);
                  }}
                />
              ))
            )}

            {program.can.add_video && (
              <div className="space-y-3 rounded-xl border border-dashed bg-muted/10 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="space-y-1">
                    <h3 className="font-semibold">إضافة فيديو جديد</h3>
                    <p className="text-sm text-muted-foreground">
                      اضغط لفتح نموذج إضافة فيديو جديد للكورس.
                    </p>
                  </div>
                  <Button type="button" onClick={() => setIsAddVideoFormOpen((prev) => !prev)}>
                    <Plus className="ms-1 h-4 w-4" />
                    {isAddVideoFormOpen ? "إغلاق النموذج" : "إضافة فيديو"}
                  </Button>
                </div>

                {isAddVideoFormOpen && (
                  <Form {...addVideoForm}>
                    <form onSubmit={submitAddVideos} className="space-y-4 rounded-lg border bg-background p-3">
                      {addVideoFieldArray.fields.map((field, index) => (
                        <ConsultantVideoFormSection
                          key={field.id}
                          index={index}
                          form={addVideoForm}
                          basePath={`videos.${index}` as const}
                          canRemove={addVideoFieldArray.fields.length > 1}
                          onRemove={() => addVideoFieldArray.remove(index)}
                        />
                      ))}

                      {Object.entries(progressByTempId).map(([tempId, percent]) => (
                        <div key={tempId} className="space-y-1">
                          <p className="text-xs text-muted-foreground">جارٍ رفع الفيديو... {percent}%</p>
                          <Progress value={percent} />
                        </div>
                      ))}

                      <div className="flex justify-end gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsAddVideoFormOpen(false)}
                          disabled={isUploading}
                        >
                          إلغاء
                        </Button>
                        <Button type="submit" disabled={isUploading}>
                          {isUploading ? "جارٍ الرفع..." : "حفظ الفيديو"}
                        </Button>
                      </div>
                    </form>
                  </Form>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {!isCreateMode && program && <ConsultantProgramSales programId={program.id} />}
    </div>
  );
}
