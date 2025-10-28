import * as z from 'zod';

export const personalSchema = z.object({
  full_name: z.string().min(2, 'الاسم يجب أن يكون أكثر من حرفين'),
  email: z.string().email('بريد إلكتروني غير صالح'),
  phone: z.string().min(8, 'رقم الهاتف قصير جدًا'),
  birth_date: z.string().refine((val) => !isNaN(Date.parse(val)), 'تاريخ غير صالح'),
  gender: z.enum(['male', 'female'], { message: 'الجنس مطلوب' }),
  image: z.instanceof(File).optional().refine((file) => !file || file.size < 5 * 1024 * 1024, 'الصورة كبيرة جدًا (أقل من 5MB)'),
});



export const medicalSchema = z.object({
  medical_specialties_id: z.string().min(1, "يرجى اختيار التخصص"),
  university_name: z.string().min(1, "اسم الجامعة مطلوب"),
  graduation_year: z.string().min(1, "سنة التخرج مطلوبة"),
  countries_certified: z.string().min(1, "يرجى إدخال الدول المعتمد فيها"),
  experience_years: z.string().min(1, "عدد سنوات الخبرة مطلوب"),
});