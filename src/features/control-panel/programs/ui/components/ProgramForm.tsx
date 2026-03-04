"use client";

import { useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useFieldArray, useForm, Controller } from "react-hook-form";
import { useSession } from "next-auth/react";
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
import { Textarea } from "@/components/ui/textarea";
import { FormSelect } from "@/shared/ui/forms/components/FormSelect";
import { ProfileImageUpload } from "@/shared/ui/forms";
import { useAddProgramVideos } from "../../hooks/useAddProgramVideos";
import { useCreateProgram } from "../../hooks/useCreateProgram";
import { useDeleteProgramVideo } from "../../hooks/useDeleteProgramVideo";
import { useUpdateProgram } from "../../hooks/useUpdateProgram";
import { useUpdateProgramVideo } from "../../hooks/useUpdateProgramVideo";
import {
  createDefaultVideo,
  createProgramSchema,
  newVideosSchema,
  updateProgramSchema,
  type CreateProgramFormValues,
  type NewVideosFormValues,
  type UpdateProgramFormValues,
} from "../../types/create-program-form";
import type { ControlPanelProgramVideo } from "../../types/program";
import { VideoFormSection } from "./VideoFormSection";
import { VideoItemCard } from "./VideoItemCard";

interface ProgramFormProps {
  mode: "create" | "edit";
  programId?: number;
  initialValues?: Partial<UpdateProgramFormValues>;
  initialVideos?: ControlPanelProgramVideo[];
}

export function ProgramForm({
  mode,
  programId,
  initialValues,
  initialVideos = [],
}: ProgramFormProps) {
  const { data: session } = useSession();
  const isCreateMode = mode === "create";
  const { createProgram, isLoading: isCreating } = useCreateProgram();
  const { updateProgram, isLoading: isUpdatingProgram } = useUpdateProgram(
    programId ?? 0,
  );
  const { addVideos, isLoading: isAddingVideos } = useAddProgramVideos(
    programId ?? 0,
  );
  const { updateVideo, isLoading: isUpdatingVideo } = useUpdateProgramVideo(
    programId ?? 0,
  );
  const { deleteVideo, isLoading: isDeletingVideo } = useDeleteProgramVideo(
    programId ?? 0,
  );

  const [videos, setVideos] = useState(initialVideos);
  const [isAddVideosFormOpen, setIsAddVideosFormOpen] = useState(false);

  const form = useForm<CreateProgramFormValues | UpdateProgramFormValues>({
    resolver: zodResolver(
      isCreateMode ? createProgramSchema : updateProgramSchema,
    ),
    defaultValues: {
      title_ar: initialValues?.title_ar ?? "",
      description_ar: initialValues?.description_ar ?? "",
      what_you_will_learn_ar: initialValues?.what_you_will_learn_ar ?? "",
      price: initialValues?.price ?? 0,
      currency: initialValues?.currency ?? "",
      cover_image: undefined,
      ...(isCreateMode ? { videos: [createDefaultVideo(1)] } : {}),
    },
    mode: "onSubmit",
  });

  // reuse same options as CenterFormStep2
  const currencyOptions = [{ value: "OMR", label: "ريال عماني (OMR)" }];

  const createVideosFieldArray = useFieldArray({
    control: form.control,
    name: "videos" as never,
  });

  const addVideoForm = useForm<NewVideosFormValues>({
    resolver: zodResolver(newVideosSchema),
    defaultValues: {
      videos: [createDefaultVideo(videos.length + 1)],
    },
  });

  const addVideosFieldArray = useFieldArray({
    control: addVideoForm.control,
    name: "videos",
  });

  const handleAddVideoField = () => {
    if (isCreateMode) {
      createVideosFieldArray.append(
        createDefaultVideo(createVideosFieldArray.fields.length + 1) as never,
      );
      return;
    }

    addVideosFieldArray.append(
      createDefaultVideo(addVideosFieldArray.fields.length + 1),
    );
  };

  const submitProgram = form.handleSubmit(async (values) => {
    if (isCreateMode) {
      const createValues = values as CreateProgramFormValues;
      await createProgram({
        creator_id: session?.user?.id ?? "",
        title_ar: createValues.title_ar,
        description_ar: createValues.description_ar,
        what_you_will_learn_ar: createValues.what_you_will_learn_ar,
        price: createValues.price,
        currency: createValues.currency,
        cover_image: createValues.cover_image as File,
        videos: createValues.videos.map((video) => ({
          ...video,
          video_path: video.video_path as File,
        })),
      });
      return;
    }

    const updateValues = values as UpdateProgramFormValues;
    await updateProgram({
      title_ar: updateValues.title_ar,
      description_ar: updateValues.description_ar,
      what_you_will_learn_ar: updateValues.what_you_will_learn_ar,
      price: updateValues.price,
      currency: updateValues.currency,
      cover_image: updateValues.cover_image,
    });
  });

  const submitAddVideos = addVideoForm.handleSubmit(async (values) => {
    if (!programId) return;

    await addVideos({
      program_id: programId,
      videos: values.videos,
    });

    setVideos((prev) => [
      ...prev,
      ...values.videos.map((video, index) => ({
        id: -(Date.now() + index),
        title: video.title_ar,
        titleAr: video.title_ar,
        description: video.description_ar,
        descriptionAr: video.description_ar,
        durationMinute: video.duration_minute,
        order: video.order,
        isProgramIntro: video.is_program_intro,
        isFree: video.is_free,
        videoPath: null,
      })),
    ]);

    addVideoForm.reset({ videos: [createDefaultVideo(videos.length + 1)] });
    setIsAddVideosFormOpen(false);
  });

  const isSubmittingProgram = isCreateMode ? isCreating : isUpdatingProgram;

  const sortedVideos = useMemo(
    () => [...videos].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
    [videos],
  );

  return (
    <div className="space-y-5">
      <Form {...form}>
        <form onSubmit={submitProgram} className="space-y-5">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">معلومات البرنامج</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              {/* program title should be first field */}
              <FormField
                control={form.control}
                name="title_ar"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>عنوان البرنامج</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="أدخل عنوان البرنامج"
                        {...field}
                        dir="rtl"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* price and currency side-by-side */}
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>السعر</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        value={field.value}
                        onChange={(event) =>
                          field.onChange(Number(event.target.value))
                        }
                        className="no-spinner"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Controller
                control={form.control}
                name="currency"
                render={({ field }) => (
                  <FormSelect
                    label="العملة"
                    placeholder="اختر العملة"
                    options={currencyOptions}
                    value={field.value}
                    onValueChange={field.onChange}
                    rtl
                    error={form.formState.errors.currency?.message}
                  />
                )}
              />

              <FormField
                control={form.control}
                name="description_ar"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>وصف البرنامج</FormLabel>
                    <FormControl>
                      <Textarea
                        rows={4}
                        placeholder="اكتب وصف البرنامج"
                        {...field}
                        dir="rtl"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="what_you_will_learn_ar"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>ماذا سيتعلم المستخدم</FormLabel>
                    <FormControl>
                      <Textarea
                        rows={4}
                        placeholder="اكتب مخرجات التعلم"
                        {...field}
                        dir="rtl"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* cover image using ProfileImageUpload component */}
              <FormField
                control={form.control}
                name="cover_image"
                render={({ field: { onChange, value, ...field } }) => (
                  <FormItem className="md:col-span-2">
                    <FormControl>
                      <ProfileImageUpload
                        label="صورة الغلاف"
                        value={value as File | null}
                        onChange={(file) => onChange(file)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {isCreateMode && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-lg">الفيديوهات</CardTitle>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddVideoField}
                >
                  <Plus className="ml-2 h-4 w-4" />
                  إضافة فيديو
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {createVideosFieldArray.fields.map((field, index) => (
                  <VideoFormSection
                    key={field.id}
                    index={index}
                    form={form as never}
                    basePath={`videos.${index}` as never}
                    canRemove={createVideosFieldArray.fields.length > 1}
                    onRemove={() => createVideosFieldArray.remove(index)}
                  />
                ))}
              </CardContent>
            </Card>
          )}

          <div className="flex justify-end rounded-lg border bg-background/95 p-3 backdrop-blur">
            <Button type="submit" disabled={isSubmittingProgram}>
              {isSubmittingProgram
                ? isCreateMode
                  ? "جاري الإنشاء..."
                  : "جاري التحديث..."
                : isCreateMode
                  ? "إنشاء البرنامج"
                  : "تحديث البرنامج"}
            </Button>
          </div>
        </form>
      </Form>

      {!isCreateMode && programId && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div className="space-y-1">
              <CardTitle className="text-lg">إدارة فيديوهات البرنامج</CardTitle>
              <p className="text-sm text-muted-foreground">
                بيانات كل فيديو معروضة بالكامل بالأسفل لتستطيع تعديل أي حقل
                مباشرة.
              </p>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {sortedVideos.length === 0 ? (
              <div className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
                لا توجد فيديوهات حالية لهذا البرنامج حتى الآن.
              </div>
            ) : (
              sortedVideos.map((video) => (
                <VideoItemCard
                  key={video.id}
                  video={video}
                  isUpdating={isUpdatingVideo}
                  isDeleting={isDeletingVideo}
                  onUpdate={async (videoId, values) => {
                    await updateVideo({ videoId, payload: values });
                    setVideos((prev) =>
                      prev.map((item) =>
                        item.id === videoId
                          ? {
                              ...item,
                              title: values.title_ar,
                              titleAr: values.title_ar,
                              description: values.description_ar,
                              descriptionAr: values.description_ar,
                              durationMinute: values.duration_minute,
                              order: values.order,
                              isProgramIntro: values.is_program_intro,
                              isFree: values.is_free,
                            }
                          : item,
                      ),
                    );
                  }}
                  onDelete={async (videoId) => {
                    await deleteVideo(videoId);
                    setVideos((prev) =>
                      prev.filter((item) => item.id !== videoId),
                    );
                  }}
                />
              ))
            )}

            <div className="rounded-xl border border-dashed bg-muted/10 p-4 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="space-y-1">
                  <h3 className="font-semibold">إضافة فيديوهات جديدة</h3>
                  <p className="text-sm text-muted-foreground">
                    اضغط على زر إضافة فيديو جديد لفتح نموذج الإضافة.
                  </p>
                </div>
                <Button
                  type="button"
                  onClick={() => setIsAddVideosFormOpen((prev) => !prev)}
                >
                  <Plus className="ml-2 h-4 w-4" />
                  {isAddVideosFormOpen
                    ? "إغلاق نموذج الإضافة"
                    : "إضافة فيديو جديد"}
                </Button>
              </div>

              {isAddVideosFormOpen ? (
                <Form {...addVideoForm}>
                  <form
                    onSubmit={submitAddVideos}
                    className="space-y-4 rounded-lg border bg-background p-3"
                  >
                    <div className="flex items-center justify-between rounded-lg border bg-muted/30 p-2">
                      <p className="text-sm text-muted-foreground">
                        عدد الفيديوهات الجديدة الجاهزة للإضافة:{" "}
                        <span className="font-semibold text-foreground">
                          {addVideosFieldArray.fields.length}
                        </span>
                      </p>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleAddVideoField}
                      >
                        <Plus className="ml-2 h-4 w-4" />
                        إضافة حقل فيديو
                      </Button>
                    </div>
                    {addVideosFieldArray.fields.map((field, index) => (
                      <VideoFormSection
                        key={field.id}
                        index={index}
                        form={addVideoForm}
                        basePath={`videos.${index}` as const}
                        canRemove={addVideosFieldArray.fields.length > 1}
                        onRemove={() => addVideosFieldArray.remove(index)}
                      />
                    ))}
                    <div className="flex justify-end gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsAddVideosFormOpen(false)}
                      >
                        إلغاء
                      </Button>
                      <Button type="submit" disabled={isAddingVideos}>
                        {isAddingVideos
                          ? "جارٍ الإضافة..."
                          : "حفظ الفيديوهات الجديدة"}
                      </Button>
                    </div>
                  </form>
                </Form>
              ) : null}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
