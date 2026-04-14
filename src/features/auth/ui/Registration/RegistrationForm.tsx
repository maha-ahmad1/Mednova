"use client";

import { useState, useMemo } from "react";
import { useForm, Controller, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  registerUser,
  type RegistrationData,
} from "@/features/auth/api/authApi";
import {
  FormInput,
  FormPasswordInput,
  FormCheckbox,
  FormSubmitButton,
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

function createRegistrationSchema(t: (key: string) => string) {
  return z
    .object({
      full_name: z.string().min(1, t("register.validation.fullNameRequired")),
      email: z.string().email(t("register.validation.invalidEmail")),
      phone: z.string().min(1, t("register.validation.phoneRequired")),
      password: z
        .string()
        .min(6, t("register.validation.passwordMin"))
        .regex(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).+$/,
          t("register.validation.passwordPattern"),
        ),
      password_confirmation: z
        .string()
        .min(1, t("register.validation.confirmRequired")),
      type_account: z.enum(["patient", "therapist", "rehabilitation_center"]),
      acceptTerms: z.boolean().refine((val) => val === true, {
        message: t("register.validation.acceptTerms"),
      }),
    })
    .refine((data) => data.password === data.password_confirmation, {
      message: t("register.validation.passwordsMismatch"),
      path: ["password_confirmation"],
    });
}

type RegistrationFormData = z.infer<
  ReturnType<typeof createRegistrationSchema>
>;

export function RegistrationForm() {
  const locale = useLocale();
  return <RegistrationFormInner key={locale} />;
}

function RegistrationFormInner() {
  const [countryCode, setCountryCode] = useState("+968");
  const [serverError, setServerError] = useState<string | null>(null);
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("Auth");
  const isRtl = locale === "ar";

  const registrationSchema = useMemo(() => createRegistrationSchema(t), [t]);

  const accountTypeOptions = useMemo(
    () => [
      {
        value: "patient" as const,
        label: t("register.accountTypePatient"),
        icon: User,
      },
      {
        value: "therapist" as const,
        label: t("register.accountTypeTherapist"),
        icon: Briefcase,
      },
      {
        value: "rehabilitation_center" as const,
        label: t("register.accountTypeCenter"),
        icon: Building2,
      },
    ],
    [t],
  );

  const methods = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: { type_account: "patient", phone: "", acceptTerms: false },
    mode: "onChange",
  });

  const {
    handleSubmit,
    formState: { errors },
    setError,
  } = methods;

  const mutation = useMutation({
    mutationFn: (data: RegistrationData) => registerUser(data),
    onSuccess: (data) => {
      if (data.success) router.push("/login");
      else setServerError(data.message || t("register.errors.unexpected"));
    },
    onError: (
      error: AxiosError<{ message?: string; data?: Record<string, string> }>,
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
      } else if (error.request)
        setServerError(t("register.errors.noConnection"));
      else setServerError(t("register.errors.unexpected"));
    },
  });

  const onSubmit = (data: RegistrationFormData) => {
    setServerError(null);
    mutation.mutate({ ...data, phone: `${countryCode}${data.phone}` });
  };

  return (
    <Card className="w-full h-full flex flex-col justify-center border-0 shadow-none bg-transparent">
      <CardHeader className="space-y-2" dir={isRtl ? "rtl" : "ltr"}>
        <CardTitle className="text-2xl font-bold text-foreground">
          {t("register.title")}
        </CardTitle>
        <CardDescription className="text-md">
          {t("register.description")}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 flex-1 flex flex-col justify-center mt-[-30px]">
        <FormProvider {...methods}>
          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            {serverError && (
              <div
                className="bg-red-100 text-red-600 border border-red-300 p-3 rounded text-sm"
                dir={isRtl ? "rtl" : "ltr"}
              >
                {serverError}
              </div>
            )}

            <FormInput
              label={t("register.fullName")}
              placeholder={t("register.fullNamePlaceholder")}
              icon={User}
              iconPosition={isRtl ? "right" : "left"}
              rtl={isRtl}
              error={errors.full_name?.message}
              {...methods.register("full_name")}
            />

            <FormInput
              label={t("register.email")}
              type="email"
              placeholder={t("register.emailPlaceholder")}
              icon={Mail}
              iconPosition={isRtl ? "right" : "left"}
              rtl={isRtl}
              error={errors.email?.message}
              {...methods.register("email")}
            />

            <Controller
              name="phone"
              control={methods.control}
              render={({ field }) => (
                <FormPhoneInput
                  label={t("register.phone")}
                  placeholder={t("register.phonePlaceholder")}
                  icon={Phone}
                  iconPosition={isRtl ? "right" : "left"}
                  countryCodeValue={countryCode}
                  onCountryCodeChange={setCountryCode}
                  error={errors.phone?.message}
                  rtl={isRtl}
                  {...field}
                />
              )}
            />

            <FormPasswordInput
              label={t("register.password")}
              placeholder={t("register.passwordPlaceholder")}
              rtl={isRtl}
              error={errors.password?.message}
              {...methods.register("password")}
            />
            <FormPasswordInput
              label={t("register.confirmPassword")}
              placeholder={t("register.confirmPasswordPlaceholder")}
              rtl={isRtl}
              error={errors.password_confirmation?.message}
              {...methods.register("password_confirmation")}
            />

            <Controller
              name="type_account"
              control={methods.control}
              render={({ field }) => (
                <FormAccountTypeSelector
                  label={t("register.accountType")}
                  options={accountTypeOptions}
                  value={field.value}
                  onChange={field.onChange}
                  rtl={isRtl}
                />
              )}
            />

            <FormCheckbox
              id="terms"
              rtl={isRtl}
              error={errors.acceptTerms?.message}
              label={t.rich("register.acceptTerms", {
                terms: (chunks) => (
                  <a href="#" className="text-[#32A88D] hover:underline">
                    {chunks}
                  </a>
                ),
                privacy: (chunks) => (
                  <a href="#" className="text-[#32A88D] hover:underline">
                    {chunks}
                  </a>
                ),
              })}
              {...methods.register("acceptTerms")}
            />

            <FormSubmitButton
              isLoading={mutation.isPending}
              loadingText={t("register.submitLoading")}
              size="lg"
            >
              {t("register.submit")}
            </FormSubmitButton>
          </form>
        </FormProvider>

        <div dir={isRtl ? "rtl" : "ltr"}>
          <span className="text-[#4B5563] text-md">{t("register.hasAccount")} </span>
          <Link href="/login" className="text-[#32A88D] hover:underline">
            {t("register.login")}
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
