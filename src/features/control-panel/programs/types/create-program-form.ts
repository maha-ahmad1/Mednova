import { z } from "zod";

const requiredFileSchema = z
  .custom<File | undefined>()
  .refine((file): file is File => file instanceof File, "الملف مطلوب");

const optionalFileSchema = z.custom<File | undefined>();

export const videoInputSchema = z.object({
  title_ar: z.string().trim().min(1, "عنوان الفيديو مطلوب"),
  description_ar: z.string().trim().min(1, "وصف الفيديو مطلوب"),
  duration_minute: z.number().min(1, "المدة يجب أن تكون دقيقة واحدة على الأقل"),
  order: z.number().min(1, "الترتيب يجب أن يبدأ من 1"),
  is_program_intro: z.boolean(),
  is_free: z.boolean(),
  video_path: optionalFileSchema,
});

export const createProgramSchema = z.object({
  title_ar: z.string().trim().min(1, "عنوان البرنامج مطلوب"),
  description_ar: z.string().trim().min(1, "وصف البرنامج مطلوب"),
  what_you_will_learn_ar: z.string().trim().min(1, "حقل ماذا ستتعلم مطلوب"),
  price: z.number().min(0, "السعر يجب أن يكون 0 أو أكثر"),
  currency: z.string().trim().min(1, "العملة مطلوبة"),
  cover_image: requiredFileSchema,
  videos: z
    .array(videoInputSchema.extend({ video_path: requiredFileSchema }))
    .min(1, "يجب إضافة فيديو واحد على الأقل"),
});

export const updateProgramSchema = z.object({
  title_ar: z.string().trim().min(1, "عنوان البرنامج مطلوب"),
  description_ar: z.string().trim().min(1, "وصف البرنامج مطلوب"),
  what_you_will_learn_ar: z.string().trim().min(1, "حقل ماذا ستتعلم مطلوب"),
  price: z.number().min(0, "السعر يجب أن يكون 0 أو أكثر"),
  currency: z.string().trim().min(1, "العملة مطلوبة"),
  cover_image: optionalFileSchema,
});

export const newVideosSchema = z.object({
  videos: z.array(videoInputSchema).min(1, "يجب إضافة فيديو واحد على الأقل"),
});

export type CreateProgramFormValues = z.input<typeof createProgramSchema>;
export type UpdateProgramFormValues = z.input<typeof updateProgramSchema>;
export type NewVideosFormValues = z.input<typeof newVideosSchema>;
export type VideoInputValues = z.input<typeof videoInputSchema>;

export const createDefaultVideo = (order = 1): VideoInputValues => ({
  title_ar: "",
  description_ar: "",
  duration_minute: 1,
  order,
  is_program_intro: false,
  is_free: false,
  video_path: undefined,
});
