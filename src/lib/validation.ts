import * as z from "zod";

export const personalSchema = z.object({
  full_name: z.string().min(2, "الاسم يجب أن يكون أكثر من حرفين"),
  email: z.string().email("بريد إلكتروني غير صالح"),
  phone: z.string().min(8, "رقم الهاتف قصير جدًا"),
  birth_date: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), "تاريخ غير صالح"),
  gender: z.enum(["male", "female"] as const, { message: "الجنس مطلوب" }),
  image: z
    .instanceof(File)
    .optional()
    .or(z.null())
    .refine((file) => !file || file.size < 5 * 1024 * 1024, {
      message: "الصورة كبيرة جدًا (أقل من 5MB)",
    }),
});

export const bioSchema = z.object({
  bio: z
    .string()
    .min(1, "النبذة لا يجب أن تكون فارغة.")
    .refine((val) => val.trim().split(/\s+/).length >= 10, {
      message: "النبذة يجب أن تكون أكثر من عشر كلمات.",
    })
    .refine((val) => val.trim().split(/\s+/).length <= 50, {
      message: "النبذة لا يجب أن تتجاوز 50 كلمة.",
    }),
});

export const medicalSchema = z.object({
  medical_specialties_id: z.string().min(1, "يرجى اختيار التخصص"),
  university_name: z.string().min(1, "اسم الجامعة مطلوب"),
  graduation_year: z.string().min(1, "سنة التخرج مطلوبة"),
  countries_certified: z.string().min(1, "يرجى إدخال الدول المعتمد فيها"),
  experience_years: z.string().min(1, "عدد سنوات الخبرة مطلوب"),
});

export const locationSchema = z.object({
  country: z.string().min(1, "حقل الدولة مطلوب"),
  city: z.string().min(1, "حقل المدينة مطلوب"),
  formatted_address: z.string().min(3, "يرجى إدخال العنوان بشكل صحيح"),
});

export const therapistLicensesSchema = z.object({
  license_number: z
    .string()
    .min(1, "رقم الترخيص مطلوب")
    .max(15, "رقم الترخيص طويل جدًا"),
  license_authority: z
    .string()
    .min(1, "جهة الترخيص مطلوبة")
    .max(100, "اسم جهة الترخيص طويل جدًا"),
  certificate_file: z
    .instanceof(File)
    .optional()
    .or(z.null())
    .refine((file) => !file || file.size <= 5 * 1024 * 1024, {
      message: "يجب ألا يتجاوز حجم الملف 5 ميغابايت",
    }),
  license_file: z
    .instanceof(File)
    .optional()
    .or(z.null())
    .refine((file) => !file || file.size <= 5 * 1024 * 1024, {
      message: "يجب ألا يتجاوز حجم الملف 5 ميغابايت",
    }),
});

export const scheduleSchema = z
  .object({
    day_of_week: z
      .array(z.string())
      .min(1, "يجب اختيار يوم عمل واحد على الأقل"),
    start_time_morning: z.string().min(1, "بداية الدوام الصباحي مطلوبة"),
    end_time_morning: z.string().min(1, "نهاية الدوام الصباحي مطلوبة"),
    timezone: z.string().min(1, "حقل المنطقة الزمنية مطلوب."),
    is_have_evening_time: z.union([z.literal(0), z.literal(1)]),
    start_time_evening: z.string().optional(),
    end_time_evening: z.string().optional(),
  })
  .refine(
    (data) =>
      !data.start_time_morning ||
      !data.end_time_morning ||
      data.end_time_morning > data.start_time_morning,
    {
      path: ["end_time_morning"],
      message: "يجب أن تكون نهاية الدوام الصباحي بعد بدايته",
    }
  )
  .refine(
    (data) =>
      data.is_have_evening_time === 0 ||
      (!!data.start_time_evening && !!data.end_time_evening),
    {
      path: ["start_time_evening"],
      message: "يجب إدخال أوقات الدوام المسائي كاملة",
    }
  );

export const personal1Schema = z.object({
  full_name: z.string().min(2, "الاسم يجب أن يكون أكثر من حرفين"),
  email: z.string().email("بريد إلكتروني غير صالح"),
  phone: z.string().min(8, "رقم الهاتف قصير جدًا"),
  birth_date: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), "تاريخ غير صالح"),
});

export const personal2Schema = z.object({
  emergency_contact: z.string().min(8, "رقم جهة الاتصال قصير جدًا"),
  gender: z.enum(["male", "female"] as const, { message: "الجنس مطلوب" }),
  country: z.string().min(2, "الدولة مطلوبة"),
  city: z.string().min(2, "المدينة مطلوبة"),
  formatted_address: z.string().min(3, "العنوان يجب أن يكون أكثر من 3 أحرف"),
  relationship: z.string().optional(),
  image: z
    .instanceof(File)
    .optional()
    .or(z.null())
    .refine((file) => !file || file.size < 5 * 1024 * 1024, {
      message: "الصورة كبيرة جدًا (أقل من 5MB)",
    }),
});

export const centerSchema = z.object({
  name_center: z.string().min(1, "اسم المركز مطلوب"),
  birth_date: z
    .string()
    .nonempty("تاريخ التأسيس مطلوب")
    .refine((val) => !isNaN(Date.parse(val)), "تاريخ التأسيس غير صالح"),

  gender: z.enum(["Male", "Female"] as const, { message: "النوع مطلوب" }),

  image: z
    .instanceof(File)
    .optional()
    .or(z.null())
    .refine(
      (file) => !file || file.size <= 5 * 1024 * 1024,
      "حجم الصورة لا يتجاوز 5MB"
    ),
});

export const pricingSchema = z.object({
  video_consultation_price: z
    .string()
    .min(1, "حقل سعر الاستشارة المرئية مطلوب."),
  chat_consultation_price: z
    .string()
    .min(1, "حقل سعر الاستشارة النصية مطلوب."),
  currency: z.string().min(1, "حقل العملة مطلوب."),
});



export const centerSpecialtiesSchema = z.object({
  specialty_id: z.array(z.string()).min(1, "يرجى اختيار تخصص واحد على الأقل"),
  year_establishment: z
    .string()
    .regex(/^\d{4}$/, "يرجى إدخال سنة صحيحة"),
});



export const registrationSchema = z
  .object({
    has_commercial_registration: z.boolean(),
    commercial_registration_number: z.string().optional(),
    commercial_registration_authority: z.string().optional(),
    license_number: z.string().min(1, "رقم الترخيص مطلوب"),
    license_authority: z.string().min(1, "جهة الترخيص مطلوبة"),
  })
  .refine(
    (data) => {
      if (data.has_commercial_registration) {
        return !!data.commercial_registration_number && !!data.commercial_registration_authority
      }
      return true
    },
    {
      message: "رقم السجل التجاري وجهة السجل التجاري مطلوبان",
      path: ["commercial_registration_number"],
    },
  )

  
