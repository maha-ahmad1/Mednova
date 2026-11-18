import { z } from "zod";
import {
  isAllowedCoverSize,
  isAllowedCoverType,
  isAllowedVideoSize,
  isAllowedVideoType,
} from "../utils/upload-rules";

/** Translator scoped to `consultantPrograms.validation` (`useTranslations("consultantPrograms.validation")`). */
export type ValidationTranslator = (key: string) => string;

// Only title_ar is required to save (create or update) — the program is a draft until it is
// submitted for review, and the backend checks completeness (cover included) at submit time.
export const PRICE_MIN = 1;
export const PRICE_MAX = 9999;

const optionalText = () => z.string().trim().optional();

export const createConsultantProgramSchema = (t: ValidationTranslator) =>
  z.object({
    title_ar: z.string().trim().min(1, t("programTitleAr")),
    title_en: optionalText(),
    description_ar: optionalText(),
    description_en: optionalText(),
    what_you_will_learn_ar: optionalText(),
    what_you_will_learn_en: optionalText(),
    // Optional while drafting; once entered it must be within the backend's range.
    price: z
      .number({ message: t("price") })
      .min(PRICE_MIN, t("price"))
      .max(PRICE_MAX, t("price"))
      .nullable()
      .optional(),
    // Optional, but a picked file is checked before upload.
    cover_image: z
      .custom<File | undefined>()
      .refine((file) => !(file instanceof File) || isAllowedCoverType(file), t("coverType"))
      .refine((file) => !(file instanceof File) || isAllowedCoverSize(file), t("coverSize")),
  });

export type ConsultantProgramFormValues = z.input<ReturnType<typeof createConsultantProgramSchema>>;

const videoFields = (t: ValidationTranslator) => ({
  title_ar: z.string().trim().min(1, t("videoTitleAr")),
  title_en: z.string().trim().min(1, t("videoTitleEn")),
  order: z.number({ message: t("order") }).min(1, t("order")),
  is_program_intro: z.boolean(),
  is_free: z.boolean(),
});

export const createConsultantVideoSchema = (t: ValidationTranslator) =>
  z.object({
    ...videoFields(t),
    video: z
      .custom<File | undefined>()
      .refine((file): file is File => file instanceof File, t("file"))
      .refine((file) => !(file instanceof File) || isAllowedVideoType(file), t("videoType"))
      .refine((file) => !(file instanceof File) || isAllowedVideoSize(file), t("videoSize")),
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
  is_program_intro: false,
  is_free: false,
  video: undefined,
});
