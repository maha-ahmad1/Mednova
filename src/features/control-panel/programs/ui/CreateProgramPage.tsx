"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useForm, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCreateProgram } from "../hooks/useCreateProgram";
import { createDefaultVideo, createProgramSchema, type CreateProgramFormValues } from "../types/create-program-form";
import { VideoFormSection } from "./components/VideoFormSection";

export function CreateProgramPage() {
  const { createProgram, isLoading } = useCreateProgram();

  const form = useForm<CreateProgramFormValues>({
    resolver: zodResolver(createProgramSchema),
    defaultValues: {
      creator_id: "",
      title_ar: "",
      description_ar: "",
      what_you_will_learn_ar: "",
      price: 0,
      currency: "SAR",
      cover_image: undefined,
      videos: [createDefaultVideo(1)],
    },
    mode: "onSubmit",
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "videos",
  });

  const handleAddVideo = () => {
    append(createDefaultVideo(fields.length + 1));
  };

  const onSubmit = async (values: CreateProgramFormValues) => {
    await createProgram({
      ...values,
      cover_image: values.cover_image as File,
      videos: values.videos.map((video) => ({
        ...video,
        video_path: video.video_path as File,
      })),
    });

    form.reset({
      creator_id: "",
      title_ar: "",
      description_ar: "",
      what_you_will_learn_ar: "",
      price: 0,
      currency: "SAR",
      cover_image: undefined,
      videos: [createDefaultVideo(1)],
    });
  };

  return (
    <div className="mx-auto w-full max-w-7xl space-y-5 p-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold text-foreground">إنشاء برنامج</h1>
        <p className="text-sm text-muted-foreground">أدخل تفاصيل البرنامج وارفع الفيديوهات المرتبطة به.</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">معلومات البرنامج</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="creator_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>معرف المنشئ</FormLabel>
                    <FormControl>
                      <Input placeholder="أدخل معرف المنشئ" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="currency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>العملة</FormLabel>
                    <FormControl>
                      <Input placeholder="SAR" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="title_ar"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>عنوان البرنامج</FormLabel>
                    <FormControl>
                      <Input placeholder="أدخل عنوان البرنامج" {...field} dir="rtl" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>السعر</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        value={field.value}
                        onChange={(event) => field.onChange(Number(event.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cover_image"
                render={({ field: { onChange, ...field } }) => (
                  <FormItem>
                    <FormLabel>صورة الغلاف</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/*"
                        {...field}
                        value={undefined}
                        onChange={(event) => onChange(event.target.files?.[0])}
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
                  <FormItem className="md:col-span-2">
                    <FormLabel>وصف البرنامج</FormLabel>
                    <FormControl>
                      <Textarea rows={4} placeholder="اكتب وصف البرنامج" {...field} dir="rtl" />
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
                      <Textarea rows={4} placeholder="اكتب مخرجات التعلم" {...field} dir="rtl" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-lg">الفيديوهات</CardTitle>
              <Button type="button" variant="outline" onClick={handleAddVideo}>
                <Plus className="ml-2 h-4 w-4" />
                إضافة فيديو
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {fields.map((field, index) => (
                <VideoFormSection
                  key={field.id}
                  index={index}
                  form={form}
                  canRemove={fields.length > 1}
                  onRemove={() => remove(index)}
                />
              ))}
            </CardContent>
          </Card>

          <div className="sticky bottom-4 z-10 flex justify-end rounded-lg border bg-background/95 p-3 backdrop-blur">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "جاري الإنشاء..." : "إنشاء البرنامج"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
