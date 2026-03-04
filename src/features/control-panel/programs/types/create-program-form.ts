import { z } from "zod";

const fileSchema = z
  .custom<File | undefined>()
  .refine((file): file is File => file instanceof File, "الملف مطلوب");

export const createProgramSchema = z.object({
  //  creator_id: z.string().trim().min(1, "معرف المنشئ مطلوب"),
  title_ar: z.string().trim().min(1, "عنوان البرنامج مطلوب"),
  description_ar: z.string().trim().min(1, "وصف البرنامج مطلوب"),
  what_you_will_learn_ar: z.string().trim().min(1, "حقل ماذا ستتعلم مطلوب"),
  price: z.number().min(0, "السعر يجب أن يكون 0 أو أكثر"),
  currency: z.string().trim().min(1, "العملة مطلوبة"),
  cover_image: fileSchema,
  videos: z.array(
    z.object({
      title_ar: z.string().trim().min(1, "عنوان الفيديو مطلوب"),
      description_ar: z.string().trim().min(1, "وصف الفيديو مطلوب"),
      duration_minute: z.number().min(1, "المدة يجب أن تكون دقيقة واحدة على الأقل"),
      order: z.number().min(1, "الترتيب يجب أن يبدأ من 1"),
      is_program_intro: z.boolean(),
      video_path: fileSchema,
    }),
  ).min(1, "يجب إضافة فيديو واحد على الأقل"),
});

export type CreateProgramFormValues = z.input<typeof createProgramSchema>;

export const createDefaultVideo = (order = 1): CreateProgramFormValues["videos"][number] => ({
  title_ar: "",
  description_ar: "",
  duration_minute: 1,
  order,
  is_program_intro: false,
  video_path: undefined,
});
