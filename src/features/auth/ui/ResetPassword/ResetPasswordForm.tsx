"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import * as z from "zod";
import { useResetPasswordStore } from "@/features/auth/store/useResetPasswordStore";
import type { AxiosError } from "axios";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { FormPasswordInput, FormSubmitButton } from "@/shared/ui/forms";
import { resetPassword } from "@/features/auth/api/authApi";

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).+$/,
        "يجب أن تحتوي على حرف كبير وحرف صغير ورمز"
      ),
    password_confirmation: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "كلمة المرور غير متطابقة",
    path: ["password_confirmation"],
  });

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export function ResetPasswordForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const { email, token, verification_method, resetAll } =
    useResetPasswordStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onChange",
  });

  const mutation = useMutation({
    mutationFn: resetPassword,
    onSuccess: (data) => {
      if (data.success) {
        resetAll();
        router.push("/login");
      } else {
        setServerError(data.message || "حدث خطأ أثناء إعادة التعيين");
      }
    },
  onError: (error:AxiosError<{ message?: string; data?: { error?: string; errors?: Record<string, string[]> } }>) => {
    console.error(" خطأ في الاتصال أو من السيرفر:", error);

    if (error.response) {
      const responseData = error.response.data;

      const backendError =
        responseData?.data?.error ||
        responseData?.data?.errors?.password?.[0] ||
        responseData?.data?.errors?.password_confirmation?.[0] ||
        responseData?.message ||
        "حدث خطأ أثناء الاتصال بالخادم";

      setServerError(backendError);
    } else if (error.request) {
      setServerError("تعذر الاتصال بالخادم. تحقق من الإنترنت.");
    } else {
      setServerError("حدث خطأ غير متوقع.");
    }
  },
  });

  const onSubmit = (data: ResetPasswordFormData) => {
    setServerError(null);
    mutation.mutate({
      email,
      token,
      verification_method,
      password: data.password,
      password_confirmation: data.password_confirmation,
    });
  };

  return (
    <Card className="w-full h-full flex flex-col justify-center border-0 shadow-none bg-transparent">
      <CardHeader dir="rtl" className="space-y-2">
        <CardTitle className="text-2xl font-bold text-foreground">
          إعادة تعيين كلمة المرور
        </CardTitle>
        <CardDescription className="text-md">
          أدخل الرمز وكلمة المرور الجديدة لتعيينها
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6 flex-1 flex flex-col justify-center mt-[-30px]">
        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} dir="rtl">
          {serverError && (
            <div className="bg-red-100 text-red-600 border border-red-300 p-3 rounded text-right text-sm">
              {serverError}
            </div>
          )}

          <FormPasswordInput
            label="كلمة المرور الجديدة"
            placeholder="أدخل كلمة المرور الجديدة"
            rtl
            error={errors.password?.message}
            {...register("password")}
          />

          <FormPasswordInput
            label="تأكيد كلمة المرور"
            placeholder="أعد إدخال كلمة المرور"
            rtl
            error={errors.password_confirmation?.message}
            {...register("password_confirmation")}
          />

          <FormSubmitButton
            isLoading={mutation.isPending}
            loadingText="جارٍ إعادة التعيين..."
            disabled={!isValid}
          >
            إعادة التعيين
          </FormSubmitButton>
        </form>
      </CardContent>
    </Card>
  );
}
