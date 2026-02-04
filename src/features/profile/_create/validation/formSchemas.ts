import { z } from "zod";

export const phoneRegex = /^(?:\+968\d{8}|\+966\d{9}|\+971\d{9}|\+965\d{8}|\+974\d{8}|\+973\d{8})$/;

export const patientFormSchema = z
  .object({
    full_name: z.string().min(1, "الاسم الكامل مطلوب"),
    email: z
      .string()
      .min(1, "البريد الإلكتروني مطلوب")
      .email("بريد إلكتروني غير صالح"),
    phone: z
      .string()
      .min(1, "رقم الهاتف مطلوب")
      .regex(
        phoneRegex,
        "رقم الهاتف يجب أن يبدأ بمفتاح الدولة ويتبع عدد الأرقام الصحيح"
      ),
    birth_date: z.string().min(1, "تاريخ الميلاد مطلوب"),
    emergency_phone: z.string().min(1, "رقم الطوارئ مطلوب"),
    relationship: z.string().min(1, "صلة القرابة مطلوبة"),
    countryCode: z.string().min(1, "رمز الدولة مطلوب"),
    gender: z.enum(["male", "female"], {
      required_error: "يرجى تحديد الجنس",
    }),
    formatted_address: z.string().min(1, "العنوان مطلوب"),
    country: z.string().min(1, "حقل البلد مطلوب."),
    city: z.string().min(1, "حقل المدينة مطلوب."),
    image: z.instanceof(File, { message: "يرجى رفع الصورة الشخصية" }),
  })
  .superRefine((data, ctx) => {
    const combined = `${data.countryCode}${data.emergency_phone}`;
    if (!phoneRegex.test(combined)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["emergency_phone"],
        message:
          "رقم الطوارئ يجب أن يبدأ بمفتاح الدولة ويتبع عدد الأرقام الصحيح",
      });
    }
  });

export const centerFormSchema = z
  .object({
    full_name: z.string().min(1, "الاسم مطلوب"),
    email: z
      .string()
      .min(1, "البريد الإلكتروني مطلوب")
      .email("بريد غير صالح"),
    phone: z
      .string()
      .min(1, "رقم الهاتف مطلوب")
      .regex(
        phoneRegex,
        "رقم الهاتف يجب أن يبدأ بمفتاح الدولة ويتبع عدد الأرقام الصحيح"
      ),
    gender: z.enum(["male", "female"], {
      required_error: "يرجى تحديد الجنس",
    }),
    formatted_address: z.string().min(1, "العنوان مطلوب"),
    year_establishment: z
      .coerce
      .number({
        required_error: "سنة التأسيس مطلوبة",
        invalid_type_error: "سنة التأسيس مطلوبة",
      })
      .int("سنة التأسيس مطلوبة")
      .min(1, "سنة التأسيس مطلوبة"),
    image: z.instanceof(File, { message: "يرجى رفع صورة المركز" }),
    name_center: z.string().min(1, "اسم المركز مطلوب"),
    birth_date: z.string().min(1, "تاريخ الميلاد مطلوب"),
    specialty_id: z
      .array(z.string())
      .min(1, "يرجى اختيار تخصص واحد على الأقل"),
    video_consultation_price: z
      .coerce
      .number({
        required_error: "حقل سعر الاستشارة المرئية مطلوب.",
        invalid_type_error: "حقل سعر الاستشارة المرئية مطلوب.",
      })
      .min(1, "حقل سعر الاستشارة المرئية مطلوب."),
    chat_consultation_price: z
      .coerce
      .number({
        required_error: "حقل سعر الاستشارة النصية مطلوب.",
        invalid_type_error: "حقل سعر الاستشارة النصية مطلوب.",
      })
      .min(1, "حقل سعر الاستشارة النصية مطلوب."),
    currency: z.string().min(1, "حقل العملة مطلوب."),
    has_commercial_registration: z.boolean({
      required_error: "حقل السجل التجاري مطلوب",
    }),
    commercial_registration_number: z.string().optional(),
    commercial_registration_authority: z.string().optional(),
    commercial_registration_file: z.instanceof(File).optional(),
    license_number: z.string().min(1, "رقم الترخيص مطلوب"),
    license_authority: z.string().min(1, "الجهة المصدرة مطلوبة"),
    license_file: z.instanceof(File, { message: "يرجى رفع ملف الترخيص" }),
    bio: z.string().min(10, "يرجى كتابة نبذة لا تقل عن 10 أحرف"),
    country: z.string().min(1, "حقل البلد مطلوب."),
    city: z.string().min(1, "حقل المدينة مطلوب."),
    timezone: z.string().min(1, "حقل المنطقة الزمنية مطلوب."),
    day_of_week: z.array(z.string()).min(1, "حقل أيام الدوام مطلوب."),
    start_time_morning: z
      .string()
      .min(1, "حقل بداية الدوام الصباحي مطلوب."),
    end_time_morning: z.string().min(1, "حقل نهاية الدوام الصباحي مطلوب."),
    is_have_evening_time: z.union([z.literal(0), z.literal(1)]),
    start_time_evening: z.string().optional(),
    end_time_evening: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.has_commercial_registration) {
      if (!data.commercial_registration_number) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["commercial_registration_number"],
          message: "رقم السجل التجاري مطلوب",
        });
      }
      if (!data.commercial_registration_authority) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["commercial_registration_authority"],
          message: "جهة السجل التجاري مطلوبة",
        });
      }
      if (!data.commercial_registration_file) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["commercial_registration_file"],
          message: "يرجى رفع ملف السجل التجاري",
        });
      }
    }

    if (data.is_have_evening_time === 1) {
      if (!data.start_time_evening) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["start_time_evening"],
          message: "حقل بداية الدوام المسائي مطلوب.",
        });
      }
      if (!data.end_time_evening) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["end_time_evening"],
          message: "حقل نهاية الدوام المسائي مطلوب.",
        });
      }
    }
  });

export const therapistFormSchema = z
  .object({
    full_name: z.string().min(1, "الاسم مطلوب"),
    email: z
      .string()
      .min(1, "البريد الإلكتروني مطلوب")
      .email("بريد غير صالح"),
    phone: z
      .string()
      .min(1, "رقم الهاتف مطلوب")
      .regex(
        phoneRegex,
        "رقم الهاتف يجب أن يبدأ بمفتاح الدولة ويتبع عدد الأرقام الصحيح"
      ),
    gender: z.enum(["male", "female"], {
      required_error: "يرجى تحديد الجنس",
    }),
    formatted_address: z.string().min(1, "العنوان مطلوب"),
    birth_date: z.string().min(1, "تاريخ الميلاد مطلوب"),
    image: z.instanceof(File, { message: "يرجى رفع صورة شخصية" }),
    medical_specialties_id: z.string().min(1, "يرجى اختيار التخصص"),
    university_name: z.string().min(1, "اسم الجامعة مطلوب"),
    graduation_year: z
      .coerce
      .number({
        required_error: "سنة التخرج مطلوبة",
        invalid_type_error: "سنة التخرج مطلوبة",
      })
      .int("سنة التخرج مطلوبة")
      .min(1, "سنة التخرج مطلوبة"),
    countries_certified: z.string().min(1, "يرجى إدخال الدول المعتمد فيها"),
    experience_years: z
      .coerce
      .number({
        required_error: "عدد سنوات الخبرة مطلوب",
        invalid_type_error: "عدد سنوات الخبرة مطلوب",
      })
      .int("عدد سنوات الخبرة مطلوب")
      .min(1, "عدد سنوات الخبرة مطلوب"),
    video_consultation_price: z
      .coerce
      .number({
        required_error: "حقل سعر الاستشارة المرئية مطلوب.",
        invalid_type_error: "حقل سعر الاستشارة المرئية مطلوب.",
      })
      .min(1, "حقل سعر الاستشارة المرئية مطلوب."),
    chat_consultation_price: z
      .coerce
      .number({
        required_error: "حقل سعر الاستشارة النصية مطلوب.",
        invalid_type_error: "حقل سعر الاستشارة النصية مطلوب.",
      })
      .min(1, "حقل سعر الاستشارة النصية مطلوب."),
    currency: z.string().min(1, "حقل العملة مطلوب."),
    license_number: z.string().min(1, "رقم الترخيص مطلوب"),
    license_authority: z.string().min(1, "الجهة المصدرة مطلوبة"),
    certificate_file: z.instanceof(File, {
      message: "يرجى رفع ملف الشهادة",
    }),
    license_file: z.instanceof(File, {
      message: "يرجى رفع ملف الترخيص",
    }),
    bio: z.string().min(10, "يرجى كتابة نبذة لا تقل عن 10 أحرف"),
    country: z.string().min(1, "حقل البلد مطلوب."),
    city: z.string().min(1, "حقل المدينة مطلوب."),
    timezone: z.string().min(1, "حقل المنطقة الزمنية مطلوب."),
    day_of_week: z.array(z.string()).min(1, "حقل أيام الدوام مطلوب."),
    start_time_morning: z
      .string()
      .min(1, "حقل بداية الدوام الصباحي مطلوب."),
    end_time_morning: z.string().min(1, "حقل نهاية الدوام الصباحي مطلوب."),
    is_have_evening_time: z.union([z.literal(0), z.literal(1)]),
    start_time_evening: z.string().optional(),
    end_time_evening: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.is_have_evening_time === 1) {
      if (!data.start_time_evening) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["start_time_evening"],
          message: "حقل بداية الدوام المسائي مطلوب.",
        });
      }
      if (!data.end_time_evening) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["end_time_evening"],
          message: "حقل نهاية الدوام المسائي مطلوب.",
        });
      }
    }
  });
