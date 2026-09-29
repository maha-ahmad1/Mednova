import { z } from "zod";

const requiredFileSchema = z
  .custom<File | undefined>()
  .refine((file): file is File => file instanceof File, "الملف مطلوب");

const optionalFileSchema = z.custom<File | undefined>();

export const consultantProgramSchema = z.object({
  title_ar: z.string().trim().min(1, "عنوان البرنامج (عربي) مطلوب"),
  title_en: z.string().trim().min(1, "عنوان البرنامج (إنجليزي) مطلوب"),
  description_ar: z.string().trim().min(1, "وصف البرنامج (عربي) مطلوب"),
  description_en: z.string().trim().min(1, "وصف البرنامج (إنجليزي) مطلوب"),
  what_you_will_learn_ar: z.string().trim().min(1, "حقل ماذا ستتعلم (عربي) مطلوب"),
  what_you_will_learn_en: z.string().trim().min(1, "حقل ماذا ستتعلم (إنجليزي) مطلوب"),
  price: z.number().min(0, "السعر يجب أن يكون 0 أو أكثر"),
  cover_image: optionalFileSchema,
});

export type ConsultantProgramFormValues = z.input<typeof consultantProgramSchema>;

export const consultantVideoSchema = z.object({
  title_ar: z.string().trim().min(1, "عنوان الفيديو (عربي) مطلوب"),
  title_en: z.string().trim().min(1, "عنوان الفيديو (إنجليزي) مطلوب"),
  order: z.number().min(1, "الترتيب يجب أن يبدأ من 1"),
  is_program_intro: z.boolean(),
  is_free: z.boolean(),
  video: requiredFileSchema,
});

export type ConsultantVideoFormValues = z.input<typeof consultantVideoSchema>;

export const newConsultantVideosSchema = z.object({
  videos: z.array(consultantVideoSchema).min(1, "يجب إضافة فيديو واحد على الأقل"),
});

export type NewConsultantVideosFormValues = z.input<typeof newConsultantVideosSchema>;

export const createDefaultConsultantVideo = (order = 1): ConsultantVideoFormValues => ({
  title_ar: "",
  title_en: "",
  order,
  is_program_intro: false,
  is_free: false,
  video: undefined,
});
