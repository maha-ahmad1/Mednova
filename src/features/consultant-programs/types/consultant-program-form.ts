import { z } from "zod";

/** Translator scoped to `consultantPrograms.validation` (`useTranslations("consultantPrograms.validation")`). */
export type ValidationTranslator = (key: string) => string;

export const createConsultantProgramSchema = (t: ValidationTranslator) =>
  z.object({
    title_ar: z.string().trim().min(1, t("programTitleAr")),
    title_en: z.string().trim().min(1, t("programTitleEn")),
    description_ar: z.string().trim().min(1, t("programDescAr")),
    description_en: z.string().trim().min(1, t("programDescEn")),
    what_you_will_learn_ar: z.string().trim().min(1, t("learnAr")),
    what_you_will_learn_en: z.string().trim().min(1, t("learnEn")),
    price: z.number().min(0, t("price")),
    cover_image: z.custom<File | undefined>(),
  });

export type ConsultantProgramFormValues = z.input<ReturnType<typeof createConsultantProgramSchema>>;

const videoFields = (t: ValidationTranslator) => ({
  title_ar: z.string().trim().min(1, t("videoTitleAr")),
  title_en: z.string().trim().min(1, t("videoTitleEn")),
  order: z.number().min(1, t("order")),
  duration_minute: z
    .number({ message: t("durationRequired") })
    .int(t("durationInt"))
    .min(1, t("durationMin")),
  is_program_intro: z.boolean(),
  is_free: z.boolean(),
});

export const createConsultantVideoSchema = (t: ValidationTranslator) =>
  z.object({
    ...videoFields(t),
    video: z
      .custom<File | undefined>()
      .refine((file): file is File => file instanceof File, t("file")),
  });

export type ConsultantVideoFormValues = z.input<ReturnType<typeof createConsultantVideoSchema>>;

// Editing an existing video never requires re-uploading the file.
export const createConsultantVideoEditSchema = (t: ValidationTranslator) =>
  z.object(videoFields(t));

export type ConsultantVideoEditFormValues = z.infer<
  ReturnType<typeof createConsultantVideoEditSchema>
>;

export const createNewConsultantVideosSchema = (t: ValidationTranslator) =>
  z.object({
    videos: z.array(createConsultantVideoSchema(t)).min(1, t("videosMin")),
  });

export type NewConsultantVideosFormValues = z.input<
  ReturnType<typeof createNewConsultantVideosSchema>
>;

export const createDefaultConsultantVideo = (order = 1): ConsultantVideoFormValues => ({
  title_ar: "",
  title_en: "",
  order,
  duration_minute: 0,
  is_program_intro: false,
  is_free: false,
  video: undefined,
});
