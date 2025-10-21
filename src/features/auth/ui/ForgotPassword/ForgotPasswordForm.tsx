"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import * as z from "zod";
import { Mail } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { AxiosError } from "axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useResetPasswordStore } from "@/features/auth/store/useResetPasswordStore";

import { FormInput, FormSubmitButton } from "@/shared/ui/forms";
import { forgotPassword } from "@/features/auth/api/authApi";

const forgotPasswordSchema = z.object({
  email: z.string().email("بريد إلكتروني غير صالح"),
});

type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>;

export function ForgotPassword() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const router = useRouter();
  const { setEmail, setVerificationMethod } = useResetPasswordStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ForgotPasswordData>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onChange",
  });

  const mutation = useMutation({
    mutationFn: forgotPassword,
    onSuccess: (data, variables) => {
      if (data.success) {
        setEmail(variables.email);
        setVerificationMethod("email");

        setSuccessMessage(
          data.message || "تم إرسال رابط إعادة التعيين إلى بريدك الإلكتروني."
        );
        setServerError(null);
        router.push(`/auth/code-verification`);
        console.log("✅ Forgot Password successful:", data.email);
      } else {
        setServerError(data.message || "حدث خطأ أثناء إرسال البريد.");
        setSuccessMessage(null);
      }
    },
    onError: (
      error: AxiosError<{ message?: string; data?: Record<string, string> }>
    ) => {
      console.error(" خطأ في Forgot Password:", error);
      const responseData = error.response?.data;
      const backendErrors = responseData?.data || {};

      if (backendErrors.email) {
        setServerError(backendErrors.email);
      } else {
        setServerError(responseData?.message || "حدث خطأ في الاتصال بالخادم");
      }

      setSuccessMessage(null);
    },
  });

  const onSubmit = (data: ForgotPasswordData) => {
    setServerError(null);
    setSuccessMessage(null);

    mutation.mutate({
      email: data.email,
      verification_method: "email",
    });
  };

  return (
    <Card className="w-full h-full flex flex-col justify-center border-0 shadow-none bg-transparent">
      <CardHeader className="space-y-2" dir="rtl">
        <CardTitle className="text-2xl font-bold text-foreground">
          إعادة تعيين كلمة المرور
        </CardTitle>
        <CardDescription className="text-md">
          أدخل بريدك الإلكتروني لإرسال رابط إعادة تعيين كلمة المرور
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6 flex-1 flex flex-col justify-center mt-[-20px]">
        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          {serverError && (
            <div className="bg-red-100 text-red-600 border border-red-300 p-3 rounded text-right text-sm">
              {serverError}
            </div>
          )}

          {/* {successMessage && (
            <div className="bg-green-100 text-green-700 border border-green-300 p-3 rounded text-right text-sm">
              {successMessage}
            </div>
          )} */}

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

          <FormSubmitButton
            isLoading={mutation.isPending}
            loadingText="جاري الإرسال..."
            size="lg"
            className="mt-4"
          >
            إرسال
          </FormSubmitButton>
        </form>

        <div className=" text-sm ">
          <span className="text-gray-600">تذكرت كلمة المرور؟ </span>
          <Link href="/auth/login" className="text-[#32A88D] hover:underline">
            تسجيل الدخول
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
