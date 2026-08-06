"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import * as z from "zod";
import { useMemo } from "react";
import { Mail } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
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

function createForgotPasswordSchema(t: (key: string) => string) {
  return z.object({
    email: z.string().email(t("validation.invalidEmail")),
  });
}

type ForgotPasswordData = z.infer<ReturnType<typeof createForgotPasswordSchema>>;

export function ForgotPassword() {
  const locale = useLocale();
  return <ForgotPasswordInner key={locale} />;
}

function ForgotPasswordInner() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const router = useRouter();
  const { setEmail, setVerificationMethod } = useResetPasswordStore();
  const t = useTranslations("forgotPassword");
  const locale = useLocale();
  const isRtl = locale === "ar";
  const forgotPasswordSchema = useMemo(() => createForgotPasswordSchema(t), [t]);

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

        setSuccessMessage(data.message || t("defaultSuccessMessage"));
        setServerError(null);
        router.push(`/code-verification`);
        console.log("✅ Forgot Password successful:", data.email);
      } else {
        setServerError(data.message || t("defaultErrorMessage"));
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
        setServerError(responseData?.message || t("connectionError"));
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
      <CardHeader className="space-y-2" dir={isRtl ? "rtl" : "ltr"}>
        <CardTitle className="text-2xl font-bold text-foreground">
          {t("title")}
        </CardTitle>
        <CardDescription className="text-md">
          {t("description")}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6 flex-1 flex flex-col justify-center mt-[-20px]">
        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          {serverError && (
            <div
              className="bg-red-100 text-red-600 border border-red-300 p-3 rounded text-sm"
              dir={isRtl ? "rtl" : "ltr"}
            >
              {serverError}
            </div>
          )}

          {/* {successMessage && (
            <div className="bg-green-100 text-green-700 border border-green-300 p-3 rounded text-sm">
              {successMessage}
            </div>
          )} */}
          <div className="pt-6 lg:pt-0">
          <FormInput
            label={t("emailLabel")}
            type="email"
            placeholder={t("emailPlaceholder")}
            icon={Mail}
            iconPosition={isRtl ? "right" : "left"}
            rtl={isRtl}
            error={errors.email?.message}
            {...register("email")}
          />
          </div>

          <FormSubmitButton
            isLoading={mutation.isPending}
            loadingText={t("sending")}
            size="lg"
            className="mt-4"
          >
            {t("sendButton")}
          </FormSubmitButton>
        </form>

        <div className="text-sm" dir={isRtl ? "rtl" : "ltr"}>
          <span className="text-gray-600">{t("rememberedPassword")} </span>
          <Link href="/login" className="cursor-pointer text-[#32A88D] hover:underline">
            {t("loginNow")}
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
