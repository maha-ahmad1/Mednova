"use client";

import { useForm, Controller, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { FormInput, FormSelect } from "@/shared/ui/forms";
import { Mail, User, IdCard, Phone, Home, Heart } from "lucide-react";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FormSubmitButton } from "@/shared/ui/forms/components/FormSubmitButton";

// ✅ Zod Schema
const therapistSchema = z.object({
  full_name: z.string().min(1, "الاسم الكامل مطلوب"),
  email: z.string().email("بريد إلكتروني غير صالح"),
  national_id: z.string().min(1, "رقم الهوية مطلوب"),
  phone: z.string().min(1, "رقم الهاتف مطلوب"),
  gender: z
    .enum(["male", "female"])
    .refine((val) => !!val, { message: "يرجى تحديد الجنس" }),
  address: z.string().min(1, "العنوان مطلوب"),
  health_status: z.string().optional(),
});

type PatientFormData = z.infer<typeof therapistSchema>;

export function TherapistForm() {
  const [isLoading, setIsLoading] = useState(false);

  const methods = useForm<PatientFormData>({
    resolver: zodResolver(therapistSchema),
    mode: "onChange",
  });

  const {
    handleSubmit,
    formState: { errors },
  } = methods;

  const onSubmit = (data: PatientFormData) => {
    setIsLoading(true);
    console.log("Patient Data Submitted:", data);
    setTimeout(() => setIsLoading(false), 1500);
  };

  return (
    <>
      <div className="mb-10 mr-60 ">
        <h1 className="text-2xl font-bold">معلومات المختص الشخصية</h1>

        <p className="text-sm text-gray-600 leading-relaxed mt-2">
          يرجى تعبئة البيانات التالية بدقة لتسهيل إجراءات المتابعة الطبية داخل
          منصة
          <span className="text-[#32A88D] font-medium"> ميدنوفا</span>.
        </p>
      </div>

      <Card className="max-w-5xl mx-auto shadow-lg border-0">
        <CardHeader className="space-y-2" dir="rtl">
          <CardTitle className="text-2xl font-bold text-foreground">
            إدخال بيانات المختص{" "}
          </CardTitle>
          <CardDescription className="text-md">
            قم بإدخال بياناتك للانضمام الى منصة ميدنوفا
          </CardDescription>
        </CardHeader>
        <CardContent className="px-14 ">
          <FormProvider {...methods}>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-6"
              dir="rtl"
            >
              {/* Row 1: الاسم + البريد */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <FormInput
                  label="الاسم الكامل"
                  placeholder="أدخل اسم المريض"
                  icon={User}
                  iconPosition="right"
                  rtl
                  error={errors.full_name?.message}
                  {...methods.register("full_name")}
                />

                <FormInput
                  label="البريد الإلكتروني"
                  type="email"
                  placeholder="example@email.com"
                  icon={Mail}
                  iconPosition="right"
                  rtl
                  error={errors.email?.message}
                  {...methods.register("email")}
                />
              </div>

              {/* Row 2: رقم الهوية + رقم الهاتف */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <FormInput
                  label="رقم الهوية"
                  placeholder="أدخل رقم الهوية"
                  icon={IdCard}
                  iconPosition="right"
                  rtl
                  error={errors.national_id?.message}
                  {...methods.register("national_id")}
                />

                <FormInput
                  label="رقم الهاتف"
                  placeholder="0000 0000"
                  icon={Phone}
                  iconPosition="right"
                  rtl
                  error={errors.phone?.message}
                  {...methods.register("phone")}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Controller
                  name="gender"
                  control={methods.control}
                  render={({ field }) => (
                    <FormSelect
                      label="الجنس"
                      rtl
                      options={[
                        { value: "male", label: "ذكر" },
                        { value: "female", label: "أنثى" },
                      ]}
                      value={field.value}
                      onChange={field.onChange}
                      error={errors.gender?.message}
                    />
                  )}
                />

                <FormInput
                  label="عنوان السكن"
                  placeholder="أدخل العنوان"
                  icon={Home}
                  iconPosition="right"
                  rtl
                  error={errors.address?.message}
                  {...methods.register("address")}
                />
              </div>

              <div>
                <FormInput
                  label="الحالة الصحية"
                  placeholder="أدخل ملاحظات عن الحالة الصحية"
                  icon={Heart}
                  iconPosition="right"
                  rtl
                  error={errors.health_status?.message}
                  {...methods.register("health_status")}
                />
              </div>

              <FormSubmitButton
                className="py-5 px-6   "
                size="sm"
                variant="default"
              >
                حفظ البيانات
              </FormSubmitButton>
            </form>
          </FormProvider>
        </CardContent>
      </Card>
    </>
  );
}
