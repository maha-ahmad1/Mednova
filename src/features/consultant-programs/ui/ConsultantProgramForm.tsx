"use client";

import { useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus, Save, Send } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
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
import { useUpdateConsultantProgramVideo } from "../hooks/useUpdateConsultantProgramVideo";
import {
  PRICE_MAX,
  PRICE_MIN,
  createConsultantProgramSchema,
  createDefaultConsultantVideo,
  createNewConsultantVideosSchema,
  type ConsultantProgramFormValues,
  type NewConsultantVideosFormValues,
} from "../types/consultant-program-form";
import type { ConsultantProgram } from "../types/consultant-program";
import { COVER_ACCEPT } from "../utils/upload-rules";
import { ConsultantProgramSales } from "./components/ConsultantProgramSales";
import { ConsultantProgramStatusBadge } from "./components/ConsultantProgramStatusBadge";
import { ConsultantVideoFormSection } from "./components/ConsultantVideoFormSection";
import { ConsultantVideoItemCard } from "./components/ConsultantVideoItemCard";

interface ConsultantProgramFormProps {
  mode: "create" | "edit";
  program?: ConsultantProgram;
}

export function ConsultantProgramForm({ mode, program }: ConsultantProgramFormProps) {
  const t = useTranslations("consultantPrograms.form");
  const tv = useTranslations("consultantPrograms.validation");
  const isCreateMode = mode === "create";
  const programSchema = useMemo(() => createConsultantProgramSchema(tv), [tv]);
  const newVideosSchema = useMemo(() => createNewConsultantVideosSchema(tv), [tv]);
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
  const { updateVideo, isLoading: isUpdatingVideo } = useUpdateConsultantProgramVideo(
    program?.id ?? 0,
  );
  const { addVideo, progressByTempId, isUploading } = useAddConsultantProgramVideo(
    program?.id ?? 0,
  );

  const [isAddVideoFormOpen, setIsAddVideoFormOpen] = useState(false);

  // Duplicate-create guard. After a successful create the mutation is no longer pending,
  // but the page is still here until router.push lands on /edit (slow with a cover upload,
  // and in dev while the edit route compiles). Without this, every extra click created
  // another copy of the program. The ref also blocks a fast double-click before React re-renders.
  const submitLockRef = useRef(false);
  const [isCreated, setIsCreated] = useState(false);

  const form = useForm<ConsultantProgramFormValues>({
    resolver: zodResolver(programSchema),
    defaultValues: {
      title_ar: program?.title_ar ?? "",
      title_en: program?.title_en ?? "",
      description_ar: program?.description_ar ?? "",
      description_en: program?.description_en ?? "",
      what_you_will_learn_ar: program?.what_you_will_learn_ar ?? "",
      what_you_will_learn_en: program?.what_you_will_learn_en ?? "",
      // Empty until the specialist sets it (null = not set yet; the price is optional on save).
      price: program?.price != null && program.price !== "" ? Number(program.price) : null,
      cover_image: undefined,
    },
    mode: "onSubmit",
  });

  const addVideoForm = useForm<NewConsultantVideosFormValues>({
    resolver: zodResolver(newVideosSchema),
    defaultValues: { videos: [createDefaultConsultantVideo((program?.videos.length ?? 0) + 1)] },
  });

  const addVideoFieldArray = useFieldArray({ control: addVideoForm.control, name: "videos" });

  const sortedVideos = useMemo(
    () => [...(program?.videos ?? [])].sort((a, b) => a.order - b.order),
    [program?.videos],
  );

  const submitProgram = form.handleSubmit(async (values) => {
    // Guards the handler itself — disabled alone leaves a render-cycle window open
    // to a second submit (Enter key or a fast double-click) before it takes effect.
    if (submitLockRef.current || isCreated || (isCreateMode ? isCreating : isUpdating)) return;

    if (isCreateMode) {
      submitLockRef.current = true;
      try {
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
        // Stay locked: the hook navigates to the edit page on success.
        setIsCreated(true);
      } catch {
        // Failed (the hook already showed the error toast): allow another try.
        submitLockRef.current = false;
      }
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
    if (isUploading) return;

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

  const isSubmittingProgram = isCreateMode ? isCreating || isCreated : isUpdating;

  return (
    <div className="space-y-5">
      {!isCreateMode && program && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-white p-4">
          <div className="flex items-center gap-3">
            <ConsultantProgramStatusBadge status={program.status} label={program.status_label} />
            {isReadOnly && (
              <span className="text-sm text-muted-foreground">
                {t("readOnly")}
              </span>
            )}
          </div>

          {program.can.submit && (
            <Button
              type="button"
              className="min-w-36"
              onClick={() => {
                if (isSubmitting || isUploading) return;
                submitForReview();
              }}
              disabled={isSubmitting || isUploading}
              title={isUploading ? t("cannotSubmitWhileUploading") : undefined}
            >
              {isSubmitting ? (
                <Loader2 className="ms-1 h-4 w-4 animate-spin" />
              ) : (
                <Send className="ms-1 h-4 w-4" />
              )}
              {isSubmitting ? t("submitting") : t("submitForReview")}
            </Button>
          )}
        </div>
      )}

      <Form {...form}>
        <fieldset disabled={isReadOnly} className="space-y-5">
          <form onSubmit={submitProgram} className="space-y-5">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t("info")}</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="title_ar"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="data-[error=true]:text-foreground">{t("titleAr")}</FormLabel>
                      <FormControl>
                        <Input placeholder={t("titleArPlaceholder")} {...field} dir="rtl" />
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
                      <FormLabel className="data-[error=true]:text-foreground">{t("titleEn")}</FormLabel>
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
                      <FormLabel className="data-[error=true]:text-foreground">{t("price")}</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={PRICE_MIN}
                          max={PRICE_MAX}
                          inputMode="decimal"
                          placeholder={t("pricePlaceholder")}
                          value={field.value ?? ""}
                          onChange={(event) =>
                            field.onChange(event.target.value === "" ? null : Number(event.target.value))
                          }
                          className="no-spinner"
                        />
                      </FormControl>
                      <FormDescription>{t("priceHint", { min: PRICE_MIN, max: PRICE_MAX })}</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description_ar"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="data-[error=true]:text-foreground">{t("descAr")}</FormLabel>
                      <FormControl>
                        <Textarea rows={4} placeholder={t("descArPlaceholder")} {...field} dir="rtl" />
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
                      <FormLabel className="data-[error=true]:text-foreground">{t("descEn")}</FormLabel>
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
                      <FormLabel className="data-[error=true]:text-foreground">{t("learnAr")}</FormLabel>
                      <FormControl>
                        <Textarea rows={4} placeholder={t("learnArPlaceholder")} {...field} dir="rtl" />
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
                      <FormLabel className="data-[error=true]:text-foreground">{t("learnEn")}</FormLabel>
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
                          label={t("cover")}
                          accept={COVER_ACCEPT}
                          value={(value as File | null) ?? program?.cover_image ?? null}
                          onChange={(file) => {
                            onChange(file ?? undefined);
                            // Validate right away so a wrong type/size shows before saving.
                            if (file) void form.trigger("cover_image");
                          }}
                          // The saved cover can only be replaced, not deleted (removing it was
                          // silently ignored by the API). "Remove" only undoes a newly picked file.
                          removable={isCreateMode || value instanceof File}
                        />
                      </FormControl>
                      <FormDescription>{t("coverHint")}</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {!isReadOnly && (
              <div className="flex justify-end rounded-lg border bg-background/95 p-3 backdrop-blur">
                <Button type="submit" className="min-w-32" disabled={isSubmittingProgram}>
                  {isSubmittingProgram ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  {isSubmittingProgram
                    ? isCreateMode
                      ? t("creating")
                      : t("updating")
                    : isCreateMode
                      ? t("create")
                      : t("update")}
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
              <CardTitle className="text-lg">{t("manageVideos")}</CardTitle>
              <p className="text-sm text-muted-foreground">
                {t("videosAdded", { count: program.videos.length })}
              </p>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {sortedVideos.length === 0 ? (
              <div className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
                {t("noVideos")}
              </div>
            ) : (
              sortedVideos.map((video) => (
                <ConsultantVideoItemCard
                  key={video.id}
                  video={video}
                  programStatus={program.status}
                  isDeleting={isDeletingVideo}
                  isUpdating={isUpdatingVideo}
                  onDelete={async (videoId) => {
                    await deleteVideo(videoId);
                  }}
                  onUpdate={async (videoId, values) => {
                    await updateVideo({ videoId, payload: values });
                  }}
                />
              ))
            )}

            {program.can.add_video && (
              <div className="space-y-3 rounded-xl border border-dashed bg-muted/10 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="space-y-1">
                    <h3 className="font-semibold">{t("addNew")}</h3>
                    <p className="text-sm text-muted-foreground">
                      {t("addNewHint")}
                    </p>
                  </div>
                  <Button type="button" onClick={() => setIsAddVideoFormOpen((prev) => !prev)}>
                    <Plus className="ms-1 h-4 w-4" />
                    {isAddVideoFormOpen ? t("closeForm") : t("addVideo")}
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
                          <p className="text-xs text-muted-foreground">{t("uploading", { percent })}</p>
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
                          {t("cancel")}
                        </Button>
                        <Button type="submit" className="min-w-28" disabled={isUploading}>
                          {isUploading && <Loader2 className="h-4 w-4 animate-spin" />}
                          {isUploading ? t("uploadingShort") : t("saveVideo")}
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
