"use client";

import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import * as z from "zod";
import { useTranslations, useLocale } from "next-intl";
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

function createResetPasswordSchema(t: (key: string) => string) {
  return z
    .object({
      password: z
        .string()
        .min(6, t("validation.passwordMin"))
        .regex(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).+$/,
          t("validation.passwordPattern")
        ),
      password_confirmation: z.string(),
    })
    .refine((data) => data.password === data.password_confirmation, {
      message: t("validation.passwordMismatch"),
      path: ["password_confirmation"],
    });
}

type ResetPasswordFormData = z.infer<ReturnType<typeof createResetPasswordSchema>>;

export function ResetPasswordForm() {
  const locale = useLocale();
  return <ResetPasswordFormInner key={locale} />;
}

function ResetPasswordFormInner() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const { email, token, verification_method, resetAll } =
    useResetPasswordStore();
  const t = useTranslations("resetPassword");
  const locale = useLocale();
  const isRtl = locale === "ar";
  const resetPasswordSchema = useMemo(() => createResetPasswordSchema(t), [t]);

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
        setServerError(data.message || t("defaultError"));
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
        t("defaultError");

      setServerError(backendError);
    } else if (error.request) {
      setServerError(t("noConnection"));
    } else {
      setServerError(t("unexpectedError"));
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
      <CardHeader dir={isRtl ? "rtl" : "ltr"} className="space-y-2">
        <CardTitle className="text-2xl font-bold text-foreground">
          {t("title")}
        </CardTitle>
        <CardDescription className="text-md">
          {t("description")}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6 flex-1 flex flex-col justify-center mt-[-30px]">
        <form
          className="space-y-5"
          onSubmit={handleSubmit(onSubmit)}
          dir={isRtl ? "rtl" : "ltr"}
        >
          {serverError && (
            <div className="bg-red-100 text-red-600 border border-red-300 p-3 rounded text-sm">
              {serverError}
            </div>
          )}

          <FormPasswordInput
            label={t("newPasswordLabel")}
            placeholder={t("newPasswordPlaceholder")}
            rtl={isRtl}
            error={errors.password?.message}
            {...register("password")}
          />

          <FormPasswordInput
            label={t("confirmPasswordLabel")}
            placeholder={t("confirmPasswordPlaceholder")}
            rtl={isRtl}
            error={errors.password_confirmation?.message}
            {...register("password_confirmation")}
          />

          <FormSubmitButton
            isLoading={mutation.isPending}
            loadingText={t("submitting")}
            disabled={!isValid}
          >
            {t("submitButton")}
          </FormSubmitButton>
        </form>
      </CardContent>
    </Card>
  );
}
