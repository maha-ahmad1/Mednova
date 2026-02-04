import { z } from "zod";

export const phoneRegex =
  /^(?:\+968\d{8}|\+966\d{9}|\+971\d{9}|\+965\d{8}|\+974\d{8}|\+973\d{8})$/;

const requiredString = (message: string) => z.string().min(1, message);

const requiredNumber = (message: string) =>
  z.preprocess(
    (value) =>
      value === "" || value === null || value === undefined
        ? undefined
        : Number(value),
    z.number({ required_error: message, invalid_type_error: message }).min(1, message)
  );

const requiredPhone = (requiredMessage: string, invalidMessage: string) =>
  z.string().min(1, requiredMessage).regex(phoneRegex, invalidMessage);

const genderSchema = z.enum(["male", "female"], {
  required_error: "يرجى تحديد الجنس",
});

const eveningScheduleRefinement = (
  data: { is_have_evening_time: 0 | 1; start_time_evening?: string; end_time_evening?: string },
  ctx: z.RefinementCtx
) => {
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
};

const patientFormShape = {
  full_name: requiredString("الاسم الكامل مطلوب"),
  email: z
    .string({ required_error: "البريد الإلكتروني مطلوب" })
    .min(1, "البريد الإلكتروني مطلوب")
    .email("بريد إلكتروني غير صالح"),
  phone: requiredPhone("رقم الهاتف مطلوب", "رقم الهاتف غير صالح"),
  birth_date: requiredString("تاريخ الميلاد مطلوب"),
  emergency_phone: requiredPhone(
    "رقم هاتف الطوارئ مطلوب",
    "رقم هاتف الطوارئ غير صالح"
  ),
  relationship: requiredString("صلة القرابة مطلوبة"),
  gender: genderSchema,
  formatted_address: requiredString("العنوان مطلوب"),
  country: requiredString("حقل البلد مطلوب."),
  city: requiredString("حقل المدينة مطلوب."),
  image: z.instanceof(File, { message: "يرجى رفع الصورة الشخصية" }),
  status: z.string().optional(),
};

export const patientFormSchema = z.object(patientFormShape);

export const patientStep1Schema = z.object({
  full_name: patientFormShape.full_name,
  email: patientFormShape.email,
  phone: patientFormShape.phone,
  birth_date: patientFormShape.birth_date,
  emergency_phone: patientFormShape.emergency_phone,
  relationship: patientFormShape.relationship,
});

export const patientStep2Schema = z.object({
  gender: patientFormShape.gender,
  formatted_address: patientFormShape.formatted_address,
  country: patientFormShape.country,
  city: patientFormShape.city,
  image: patientFormShape.image,
  status: patientFormShape.status,
});

const centerFormShape = {
  full_name: requiredString("الاسم مطلوب"),
  email: z
    .string({ required_error: "البريد الإلكتروني مطلوب" })
    .min(1, "البريد الإلكتروني مطلوب")
    .email("بريد غير صالح"),
  phone: requiredPhone("رقم الهاتف مطلوب", "رقم الهاتف غير صالح"),
  gender: genderSchema,
  formatted_address: requiredString("العنوان مطلوب"),
  year_establishment: requiredNumber("سنة التأسيس مطلوبة"),
  image: z.instanceof(File, { message: "يرجى رفع صورة المركز" }),
  name_center: requiredString("اسم المركز مطلوب"),
  birth_date: requiredString("تاريخ الميلاد مطلوب"),
  specialty_id: z
    .array(z.string())
    .min(1, "يرجى اختيار تخصص واحد على الأقل"),
  video_consultation_price: requiredNumber("حقل سعر الاستشارة المرئية مطلوب."),
  chat_consultation_price: requiredNumber("حقل سعر الاستشارة النصية مطلوب."),
  currency: requiredString("حقل العملة مطلوب."),
  has_commercial_registration: z.boolean({
    required_error: "يرجى تحديد وجود سجل تجاري",
  }),
  commercial_registration_number: z.string().optional(),
  commercial_registration_authority: z.string().optional(),
  commercial_registration_file: z
    .instanceof(File, { message: "ملف السجل التجاري مطلوب" })
    .optional(),
  license_number: requiredString("رقم الترخيص مطلوب"),
  license_authority: requiredString("الجهة المصدرة مطلوبة"),
  license_file: z.instanceof(File, { message: "ملف الترخيص مطلوب" }),
  bio: requiredString("يرجى كتابة نبذة لا تقل عن 10 أحرف").min(
    10,
    "يرجى كتابة نبذة لا تقل عن 10 أحرف"
  ),
  day_of_week: z.array(z.string()).min(1, "حقل أيام الدوام مطلوب."),
  start_time_morning: requiredString("حقل بداية الدوام الصباحي مطلوب."),
  end_time_morning: requiredString("حقل نهاية الدوام الصباحي مطلوب."),
  is_have_evening_time: z.union([z.literal(0), z.literal(1)], {
    required_error: "يرجى تحديد وجود دوام مسائي",
  }),
  start_time_evening: z.string().optional(),
  end_time_evening: z.string().optional(),
  country: requiredString("حقل البلد مطلوب."),
  city: requiredString("حقل المدينة مطلوب."),
  timezone: requiredString("حقل المنطقة الزمنية مطلوب."),
  status: z.string().optional(),
};

export const centerFormSchema = z
  .object(centerFormShape)
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
          message: "ملف السجل التجاري مطلوب",
        });
      }
    }

    eveningScheduleRefinement(
      {
        is_have_evening_time: data.is_have_evening_time,
        start_time_evening: data.start_time_evening,
        end_time_evening: data.end_time_evening,
      },
      ctx
    );
  });

export const centerStep1Schema = z.object({
  full_name: centerFormShape.full_name,
  email: centerFormShape.email,
  phone: centerFormShape.phone,
  gender: centerFormShape.gender,
  formatted_address: centerFormShape.formatted_address,
  year_establishment: centerFormShape.year_establishment,
  image: centerFormShape.image,
  name_center: centerFormShape.name_center,
  birth_date: centerFormShape.birth_date,
});

export const centerStep2Schema = z.object({
  specialty_id: centerFormShape.specialty_id,
  video_consultation_price: centerFormShape.video_consultation_price,
  chat_consultation_price: centerFormShape.chat_consultation_price,
  currency: centerFormShape.currency,
});

export const centerStep3Schema = z
  .object({
    has_commercial_registration: centerFormShape.has_commercial_registration,
    commercial_registration_number: centerFormShape.commercial_registration_number,
    commercial_registration_authority: centerFormShape.commercial_registration_authority,
    commercial_registration_file: centerFormShape.commercial_registration_file,
    license_number: centerFormShape.license_number,
    license_authority: centerFormShape.license_authority,
    license_file: centerFormShape.license_file,
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
          message: "ملف السجل التجاري مطلوب",
        });
      }
    }
  });

export const centerStep4Schema = z
  .object({
    country: centerFormShape.country,
    city: centerFormShape.city,
    timezone: centerFormShape.timezone,
    day_of_week: centerFormShape.day_of_week,
    start_time_morning: centerFormShape.start_time_morning,
    end_time_morning: centerFormShape.end_time_morning,
    is_have_evening_time: centerFormShape.is_have_evening_time,
    start_time_evening: centerFormShape.start_time_evening,
    end_time_evening: centerFormShape.end_time_evening,
  })
  .superRefine((data, ctx) => eveningScheduleRefinement(data, ctx));

export const centerStep5Schema = z.object({
  bio: centerFormShape.bio,
  status: centerFormShape.status,
});

const therapistFormShape = {
  full_name: requiredString("الاسم مطلوب"),
  email: z
    .string({ required_error: "البريد الإلكتروني مطلوب" })
    .min(1, "البريد الإلكتروني مطلوب")
    .email("بريد غير صالح"),
  phone: requiredPhone("رقم الهاتف مطلوب", "رقم الهاتف غير صالح"),
  gender: genderSchema,
  formatted_address: requiredString("العنوان مطلوب"),
  birth_date: requiredString("تاريخ الميلاد مطلوب"),
  image: z.instanceof(File, { message: "يرجى رفع صورة شخصية" }),
  medical_specialties_id: requiredString("يرجى اختيار التخصص"),
  university_name: requiredString("اسم الجامعة مطلوب"),
  graduation_year: requiredNumber("سنة التخرج مطلوبة"),
  countries_certified: requiredString("يرجى إدخال الدول المعتمد فيها"),
  experience_years: requiredNumber("عدد سنوات الخبرة مطلوب"),
  video_consultation_price: requiredNumber("حقل سعر الاستشارة المرئية مطلوب."),
  chat_consultation_price: requiredNumber("حقل سعر الاستشارة النصية مطلوب."),
  currency: requiredString("حقل العملة مطلوب."),
  license_number: requiredString("رقم الترخيص مطلوب"),
  license_authority: requiredString("الجهة المصدرة مطلوبة"),
  certificate_file: z.instanceof(File, { message: "ملف الشهادة مطلوب" }),
  license_file: z.instanceof(File, { message: "ملف الترخيص مطلوب" }),
  bio: requiredString("يرجى كتابة نبذة لا تقل عن 10 أحرف").min(10, "يرجى كتابة نبذة لا تقل عن 10 أحرف"),
  day_of_week: z.array(z.string()).min(1, "حقل أيام الدوام مطلوب."),
  start_time_morning: requiredString("حقل بداية الدوام الصباحي مطلوب."),
  end_time_morning: requiredString("حقل نهاية الدوام الصباحي مطلوب."),
  is_have_evening_time: z.union([z.literal(0), z.literal(1)], {
    required_error: "يرجى تحديد وجود دوام مسائي",
  }),
  start_time_evening: z.string().optional(),
  end_time_evening: z.string().optional(),
  country: requiredString("حقل البلد مطلوب."),
  city: requiredString("حقل المدينة مطلوب."),
  timezone: requiredString("حقل المنطقة الزمنية مطلوب."),
  status: z.string().optional(),
};

export const therapistFormSchema = z
  .object(therapistFormShape)
  .superRefine((data, ctx) =>
    eveningScheduleRefinement(
      {
        is_have_evening_time: data.is_have_evening_time,
        start_time_evening: data.start_time_evening,
        end_time_evening: data.end_time_evening,
      },
      ctx
    )
  );

export const therapistStep1Schema = z.object({
  full_name: therapistFormShape.full_name,
  email: therapistFormShape.email,
  phone: therapistFormShape.phone,
  gender: therapistFormShape.gender,
  formatted_address: therapistFormShape.formatted_address,
  birth_date: therapistFormShape.birth_date,
  image: therapistFormShape.image,
});

export const therapistStep2Schema = z.object({
  medical_specialties_id: therapistFormShape.medical_specialties_id,
  university_name: therapistFormShape.university_name,
  graduation_year: therapistFormShape.graduation_year,
  countries_certified: therapistFormShape.countries_certified,
  experience_years: therapistFormShape.experience_years,
  video_consultation_price: therapistFormShape.video_consultation_price,
  chat_consultation_price: therapistFormShape.chat_consultation_price,
  currency: therapistFormShape.currency,
});

export const therapistStep3Schema = z.object({
  license_number: therapistFormShape.license_number,
  license_authority: therapistFormShape.license_authority,
  certificate_file: therapistFormShape.certificate_file,
  license_file: therapistFormShape.license_file,
});

export const therapistStep4Schema = z
  .object({
    country: therapistFormShape.country,
    city: therapistFormShape.city,
    day_of_week: therapistFormShape.day_of_week,
    start_time_morning: therapistFormShape.start_time_morning,
    end_time_morning: therapistFormShape.end_time_morning,
    is_have_evening_time: therapistFormShape.is_have_evening_time,
    start_time_evening: therapistFormShape.start_time_evening,
    end_time_evening: therapistFormShape.end_time_evening,
    timezone: therapistFormShape.timezone,
  })
  .superRefine((data, ctx) => eveningScheduleRefinement(data, ctx));

export const therapistStep5Schema = z.object({
  bio: therapistFormShape.bio,
  status: therapistFormShape.status,
});
