"use client";
import { useTranslations, useLocale } from "next-intl";
import { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import * as z from "zod";
import { Link } from "@/i18n/navigation";
import { Mail } from "lucide-react";
import axios from "axios";
import { signIn } from "next-auth/react";
import { useSession } from "next-auth/react";
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
} from "@/shared/ui/forms";
import { loginUser, type LoginData } from "@/features/auth/api/authApi";
import { useSearchParams } from "next/navigation";

type BackendErrorResponse = {
  success: boolean;
  message?: string;
  data?: Record<string, string>;
  status?: string;
};

function createLoginSchema(
  t: (key: string) => string,
) {
  return z.object({
    email: z.string().email(t("validation.invalidEmail")),
    password: z
      .string()
      .min(6, t("validation.passwordMin"))
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).+$/,
        t("validation.passwordPattern"),
      ),
    remember: z.boolean().optional(),
  });
}

type LoginFormData = z.infer<ReturnType<typeof createLoginSchema>>;

export function LoginForm() {
  const locale = useLocale();
  return <LoginFormInner key={locale} />;
}

function LoginFormInner() {
  const [serverError, setServerError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { data: session } = useSession();
  const locale = useLocale();
  const t = useTranslations("login");
  const isRtl = locale === "ar";
  const loginSchema = useMemo(() => createLoginSchema(t), [t]);
  console.log("session " + session?.role);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });

  useEffect(() => {
    const message = searchParams.get("message");

    if (message) {
      if (message === "verified") {
        setSuccessMessage(t("successVerified"));
      }

      if (message === "already_verified") {
        setSuccessMessage(t("successAlreadyVerified"));
      }

      const url = new URL(window.location.href);
      url.searchParams.delete("message");
      window.history.replaceState({}, "", url.toString());
    }
  }, [searchParams, t]);

  const mutation = useMutation({
    mutationFn: (data: LoginData) => loginUser(data),

    onSuccess: async (data) => {
      console.log("response from backend:", data);

      if (!data.success) {
        if (data.data) {
          Object.entries(data.data).forEach(([field, message]) => {
            setError(field as keyof LoginFormData, {
              type: "server",
              message: message as string,
            });
          });
        }
        if (data.message) {
          setServerError(data.message);
        }
        return;
      }
      await signIn("credentials", {
        redirect: false,
        access_token: data.data.access_token,
        user: JSON.stringify(data.data.user),
      });

      const user = data.data.user;
      if (!user.is_completed) {
        router.push("/profile/create");
      } else {
        router.push("/profile");
      }
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        console.log("Error response:", error.response?.data);

        const backendData = error.response?.data as BackendErrorResponse;

        // ✅ معالجة الحالة الأولى: أخطاء الحقول (422)
        if (error.response?.status === 422 && backendData?.data) {
          if (backendData.data.email) {
            setError("email", {
              type: "server",
              message: backendData.data.email,
            });
          }
          if (backendData.data.password) {
            setError("password", {
              type: "server",
              message: backendData.data.password,
            });
          }
        }
        // ✅ معالجة الحالة الثانية: errors عامة في data.error (500)
        else if (backendData?.data?.error) {
          setServerError(backendData.data.error);
        }
        // ✅ معالجة الحالة الثالثة: رسالة عامة
        else if (backendData?.message) {
          setServerError(backendData.message);
        }
        else {
          setServerError(t("errors.unexpected"));
        }
      } else {
        setServerError(t("errors.unexpected"));
      }
    },
  });

  // const mutation = useMutation({
  //   mutationFn: (data: LoginData) => loginUser(data),
  //   onSuccess: async (data) => {
  //     console.log("✅ تسجيل الدخول بنجاح:", data);
  //     if (data.success) {
  //       await signIn("credentials", {
  //         redirect: false,
  //         access_token: data.data.access_token,
  //         user: JSON.stringify(data.data.user),
  //       });

  //       const user = data.data.user;
  //               console.log("✅ user.is_completed", user.is_completed);

  //       if (!user.is_completed) {
  //         router.push("/profile/create");

  //       } else {
  //         router.push("/profile");
  //       }
  //     } else {
  //       setServerError(data.message || "حدث خطأ غير متوقع");
  //     }

  //   },

  //   onError: (
  //     error: AxiosError<{ message?: string; data?: Record<string, string> }>
  //   ) => {
  //     console.error("خطأ أثناء تسجيل الدخول:", error);

  //     if (error.response) {
  //       const responseData = error.response.data;
  //       const backendErrors = responseData.data || {};

  //       Object.entries(backendErrors).forEach(([field, message]) => {
  //         if (typeof message === "string") {
  //           setError(field as keyof LoginFormData, {
  //             type: "server",
  //             message,
  //           });
  //         }
  //       });

  //       if (responseData.message && Object.keys(backendErrors).length === 0) {
  //         setServerError(responseData.message);
  //       }
  //     } else if (error.request) {
  //       setServerError("لا يوجد اتصال بالخادم");
  //     } else {
  //       setServerError("حدث خطأ غير متوقع");
  //     }
  //   },
  // });

  const onSubmit = (data: LoginFormData) => {
    setServerError(null);
    mutation.mutate(data);
  };

  return (
    <Card className="w-full h-full flex flex-col justify-center border-0 shadow-none bg-transparent">
      <CardHeader className="space-y-2" dir={isRtl ? "rtl" : "ltr"}>
        <CardTitle className="text-2xl font-bold text-foreground">
          {t("title")}
        </CardTitle>
        <CardDescription className="text-md">{t("description")}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6 flex-1 flex flex-col justify-center mt-[-30px]">
        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          {successMessage && (
            <div
              className="bg-green-100 text-green-700 border border-green-300 p-3 rounded text-sm"
              dir={isRtl ? "rtl" : "ltr"}
            >
              {successMessage}
            </div>
          )}
          {serverError && (
            <div
              className="bg-red-100 text-red-600 border border-red-300 p-3 rounded text-sm"
              dir={isRtl ? "rtl" : "ltr"}
            >
              {serverError}
            </div>
          )}

          <FormInput
            label={t("email")}
            type="email"
            placeholder={t("emailPlaceholder")}
            icon={Mail}
            iconPosition={isRtl ? "right" : "left"}
            rtl={isRtl}
            error={errors.email?.message}
            {...register("email")}
          />

          <FormPasswordInput
            label={t("password")}
            placeholder={t("passwordPlaceholder")}
            rtl={isRtl}
            error={errors.password?.message}
            {...register("password")}
          />

          <div
            className="flex items-start gap-2"
            dir={isRtl ? "rtl" : "ltr"}
          >
            <input
              type="checkbox"
              id="terms"
              className="mt-1 rounded border-border cursor-pointer"
              {...register("remember")}
            />
            <div className="flex justify-between w-full">
              <Label htmlFor="terms" className="text-sm text-muted-foreground ">
                {t("rememberMe")}
              </Label>
              <Link
                href="/forgot-password"
                className="text-sm text-[#32A88D] cursor-pointer"
              >
                {t("forgotPassword")}
              </Link>
            </div>
          </div>

          <FormSubmitButton
            isLoading={mutation.isPending}
            loadingText={t("loading")}
            size="lg"
            className="cursor-pointer"
          >
            {t("button")}
          </FormSubmitButton>
        </form>

        {/* ✅ Divider */}
        {/* <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-[13px]">أو من خلال</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8">
          <SocialLoginButton
            provider="google"
            onClick={() => signIn("google")}
          />
          <SocialLoginButton
            provider="facebook"
            onClick={() => signIn("facebook")}
          />
        </div> */}

        <div dir={isRtl ? "rtl" : "ltr"}>
          <span className="text-[#4B5563] text-md">{t("noAccount")} </span>
          <Link href="/register" className="text-[#32A88D] hover:underline">
            {t("registerNow")}
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

