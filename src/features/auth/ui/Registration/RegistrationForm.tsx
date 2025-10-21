"use client";

import { useState } from "react";
import { useForm, Controller, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  registerUser,
  type RegistrationData,
} from "@/features/auth/api/authApi";
import {
  FormInput,
  FormPasswordInput,
  FormCheckbox,
  FormSubmitButton,
  SocialLoginButton,
  FormAccountTypeSelector,
  FormPhoneInput,
} from "@/shared/ui/forms";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { User, Briefcase, Building2, Mail, Phone } from "lucide-react";
import type { AxiosError } from "axios";

// ---------------- Zod Schema ----------------
const registrationSchema = z
  .object({
    full_name: z.string().min(1, "الاسم الكامل مطلوب"),
    email: z.string().email("بريد إلكتروني غير صالح"),
    phone: z.string().min(1, "رقم الهاتف مطلوب"),
    password: z
      .string()
      .min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).+$/,
        "يجب أن تحتوي كلمة المرور على حرف كبير وحرف صغير ورمز واحد على الأقل"
      ),
    password_confirmation: z.string().min(1, "تأكيد كلمة المرور مطلوب"),
    type_account: z.enum(["patient", "therapist", "rehabilitation_center"]),
    acceptTerms: z
      .boolean()
      .refine((val) => val === true, "يجب الموافقة على الشروط"),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "كلمات المرور غير متطابقة",
    path: ["password_confirmation"],
  });

type RegistrationFormData = z.infer<typeof registrationSchema>;

// ---------------- Registration Form ----------------
export function RegistrationForm() {
  const [countryCode, setCountryCode] = useState("+968");
  const [serverError, setServerError] = useState<string | null>(null);
  const router = useRouter();

  const methods = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: { type_account: "patient", phone: "", acceptTerms: false },
    mode: "onChange",
  });

  const {
    handleSubmit,
    formState: { errors, isValid },
    setError,
  } = methods;

  const mutation = useMutation({
    mutationFn: (data: RegistrationData) => registerUser(data),
    onSuccess: (data) => {
      if (data.success) router.push("/auth/login");
      else setServerError(data.message || "حدث خطأ غير متوقع");
    },
    onError: (
      error: AxiosError<{ message?: string; data?: Record<string, string> }>
    ) => {
      if (error.response?.data) {
        const backendErrors = error.response.data.data || {};
        Object.entries(backendErrors).forEach(([field, message]) => {
          if (typeof message === "string")
            setError(field as keyof RegistrationFormData, {
              type: "server",
              message,
            });
        });
        if (
          error.response.data.message &&
          Object.keys(backendErrors).length === 0
        )
          setServerError(error.response.data.message);
      } else if (error.request) setServerError("لا يوجد اتصال بالخادم");
      else setServerError("حدث خطأ غير متوقع");
    },
  });

  const onSubmit = (data: RegistrationFormData) => {
    setServerError(null);
    mutation.mutate({ ...data, phone: `${countryCode}${data.phone}` });
  };

  return (
    <Card className="w-full h-full flex flex-col justify-center border-0 shadow-none bg-transparent">
      <CardHeader className="space-y-2" dir="rtl">
        <CardTitle className="text-2xl font-bold text-foreground">
          إنشاء حساب جديد
        </CardTitle>
        <CardDescription className="text-md">
          قم بإدخال بياناتك للانضمام الى منصة ميدنوفا
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 flex-1 flex flex-col justify-center mt-[-30px]">
        <FormProvider {...methods}>
          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            {serverError && (
              <div className="bg-red-100 text-red-600 border border-red-300 p-3 rounded text-right text-sm">
                {serverError}
              </div>
            )}

            {/* Full Name */}
            <FormInput
              label="الاسم الكامل"
              placeholder="أدخل اسمك الكامل"
              icon={User}
              iconPosition="right"
              rtl
              error={errors.full_name?.message}
              {...methods.register("full_name")}
            />

            {/* Email */}
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

            {/* Phone */}
            <Controller
              name="phone"
              control={methods.control}
              render={({ field }) => (
                <FormPhoneInput
                  label="رقم الهاتف"
                  placeholder="0000 0000"
                  icon={Phone}
                  iconPosition="right"
                  rtl
                  countryCodeValue={countryCode}
                  onCountryCodeChange={setCountryCode}
                  error={errors.phone?.message}
                  {...field}
                />
              )}
            />

            {/* Passwords */}
            <FormPasswordInput
              label="كلمة المرور"
              placeholder="أدخل كلمة المرور"
              rtl
              error={errors.password?.message}
              {...methods.register("password")}
            />
            <FormPasswordInput
              label="تأكيد كلمة المرور"
              placeholder="تأكيد كلمة المرور"
              rtl
              error={errors.password_confirmation?.message}
              {...methods.register("password_confirmation")}
            />

            {/* Account Type */}
            <Controller
              name="type_account"
              control={methods.control}
              render={({ field }) => (
                <FormAccountTypeSelector
                  label="نوع الحساب"
                  options={[
                    { value: "patient", label: "مريض", icon: User },
                    { value: "therapist", label: "مختص", icon: Briefcase },
                    {
                      value: "rehabilitation_center",
                      label: "مركز تأهيلي",
                      icon: Building2,
                    },
                  ]}
                  value={field.value}
                  onChange={field.onChange}
                  rtl
                />
              )}
            />

            {/* Accept Terms */}
            <FormCheckbox
              id="terms"
              rtl
              error={errors.acceptTerms?.message}
              label={
                <>
                  أوافق على{" "}
                  <a href="#" className="text-[#32A88D] hover:underline">
                    الشروط والأحكام
                  </a>{" "}
                  و{" "}
                  <a href="#" className="text-[#32A88D] hover:underline">
                    سياسة الخصوصية
                  </a>
                </>
              }
              {...methods.register("acceptTerms")}
            />

            {/* Submit */}
            <FormSubmitButton
              isLoading={mutation.isPending}
              loadingText="جاري الإنشاء..."
              size="lg"
            >
              إنشاء حساب
            </FormSubmitButton>
          </form>
        </FormProvider>

        {/* Social Login */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-[13px]">أو من خلال</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-8">
          <SocialLoginButton provider="google" />
          <SocialLoginButton provider="facebook" />
        </div>

        {/* Login Link */}
        <div>
          <span className="text-[#4B5563] text-md cursor-default">
            لديك حساب بالفعل؟
          </span>{" "}
          <Link href="/auth/login" className="text-[#32A88D] hover:underline">
            تسجيل دخول
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
