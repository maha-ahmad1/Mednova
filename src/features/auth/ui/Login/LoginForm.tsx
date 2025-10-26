"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import * as z from "zod";
import Link from "next/link";
import { Mail } from "lucide-react";
import type { AxiosError } from "axios";
import { signIn } from "next-auth/react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Label } from "@/components/ui/label";
import {
  FormInput,
  FormPasswordInput,
  FormSubmitButton,
  SocialLoginButton,
} from "@/shared/ui/forms";

import { loginUser, type LoginData } from "@/features/auth/api/authApi";

const loginSchema = z.object({
  email: z.string().email("بريد إلكتروني غير صالح"),
  password: z
    .string()
    .min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).+$/,
      "يجب أن تحتوي كلمة المرور على حرف كبير وحرف صغير ورمز واحد على الأقل"
    ),
  remember: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const [serverError, setServerError] = useState<string | null>(null);
  const router = useRouter();


  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });

  const mutation = useMutation({
    
    mutationFn: (data: LoginData) => loginUser(data),
    onSuccess: async (data) => {
      console.log("✅ تسجيل الدخول بنجاح:", data);
      if (data.success) {
        await signIn("credentials", {
          redirect: false,
          access_token: data.data.access_token,
          user: JSON.stringify(data.data.user),
        });
        const user = data.data.user; 
        const isCompleted = user.phone && user.gender && user.birth_date;

        if (!isCompleted) {
          if (user.type_account === "patient") router.push("/account/patient");
          else if (user.type_account === "therapist")
            router.push("/account/therapist");
          else router.push("/account/rehabilitation-center");
        } else {
          router.push("/");
        }
      } else {
        setServerError(data.message || "حدث خطأ غير متوقع");
      }
    },
    onError: (
      error: AxiosError<{ message?: string; data?: Record<string, string> }>
    ) => {
      console.error("خطأ أثناء تسجيل الدخول:", error);

      if (error.response) {
        const responseData = error.response.data;
        const backendErrors = responseData.data || {};

        Object.entries(backendErrors).forEach(([field, message]) => {
          if (typeof message === "string") {
            setError(field as keyof LoginFormData, {
              type: "server",
              message,
            });
          }
        });

        if (responseData.message && Object.keys(backendErrors).length === 0) {
          setServerError(responseData.message);
        }
      } else if (error.request) {
        setServerError("لا يوجد اتصال بالخادم");
      } else {
        setServerError("حدث خطأ غير متوقع");
      }
    },
  });

  const onSubmit = (data: LoginFormData) => {
    setServerError(null);
    mutation.mutate(data);
  };

  return (
    <Card className="w-full h-full flex flex-col justify-center border-0 shadow-none bg-transparent">
      <CardHeader className="space-y-2" dir="rtl">
        <CardTitle className="text-2xl font-bold text-foreground">
          تسجيل الدخول
        </CardTitle>
        <CardDescription className="text-md">
          قم بإدخال بياناتك للانضمام إلى منصة ميدنوفا
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6 flex-1 flex flex-col justify-center mt-[-30px]">
        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          {serverError && (
            <div className="bg-red-100 text-red-600 border border-red-300 p-3 rounded text-right text-sm">
              {serverError}
            </div>
          )}

          <FormInput
            label="البريد الإلكتروني"
            type="email"
            placeholder="example@email.com"
            icon={Mail}
            iconPosition="right"
            rtl
            error={errors.email?.message}
            {...register("email")}
          />

          <FormPasswordInput
            label="كلمة المرور"
            placeholder="أدخل كلمة المرور"
            rtl
            error={errors.password?.message}
            {...register("password")}
          />

          {/* ✅ Remember me & Forgot password */}
          <div className="flex items-start gap-2" dir="rtl">
            <input
              type="checkbox"
              id="terms"
              className="mt-1 rounded border-border"
              {...register("remember")}
            />
            <div className="flex justify-between w-full">
              <Label
                htmlFor="terms"
                className="text-sm text-muted-foreground cursor-pointer"
              >
                تذكرني
              </Label>
              <Link
                href="/auth/forgot-password"
                className="text-sm text-[#32A88D] cursor-pointer"
              >
                نسيت كلمة المرور؟
              </Link>
            </div>
          </div>

          <FormSubmitButton
            isLoading={mutation.isPending}
            loadingText="جاري تسجيل الدخول..."
            size="lg"
          >
            تسجيل الدخول
          </FormSubmitButton>
        </form>

        {/* ✅ Divider */}
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

        <div>
          <a href="#" className="text-[#4B5563] text-md cursor-default">
            ليس لديك حساب؟
          </a>{" "}
          <Link
            href="/auth/register"
            className="text-[#32A88D] hover:underline"
          >
            أنشئ حسابك الآن
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
