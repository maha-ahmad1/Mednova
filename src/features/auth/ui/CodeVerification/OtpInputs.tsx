"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import * as z from "zod";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { verifyToken, forgotPassword } from "@/features/auth/api/authApi";
import type { AxiosError } from "axios";
import { useResetPasswordStore } from "@/features/auth/store/useResetPasswordStore";

const otpSchema = z.object({
  token: z.string().length(4, "يجب إدخال جميع الأرقام الأربعة"),
});

type OtpFormData = z.infer<typeof otpSchema>;

// interface OtpInputsProps {
//   email: string;
// }

export function OtpInputs() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [isResending, setIsResending] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);
  const { email, setToken } = useResetPasswordStore();

  const router = useRouter();
  // const searchParams = useSearchParams()
  // const email = searchParams.get("email") || ""

  console.log("email:", email);
  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<OtpFormData>({
    resolver: zodResolver(otpSchema),
    mode: "onChange",
    defaultValues: {
      token: "",
    },
  });

  const token = watch("token");

  const mutation = useMutation({
    mutationFn: (data: {
      email: string;
      token: string;
      verification_method: string;
    }) => verifyToken(data),
    onSuccess: (data, variables) => {
      console.log("✅ تم التحقق من الرمز بنجاح:", data);

      if (data.success) {
        setToken(variables.token);

        router.push("/auth/reset-password");
      } else {
        setServerError(data.message || "حدث خطأ غير متوقع");
      }
    },
    onError: (
      error: AxiosError<{
        message?: string;
        data?: { error?: string; errors?: Record<string, string[]> };
      }>
    ) => {
      console.error("❌ خطأ أثناء التحقق من الرمز:", error);

      if (error.response) {
        const responseData = error.response.data;

        const backendError =
          responseData.data?.error || 
          responseData.data?.errors?.token?.[0] || 
          responseData.message || 
          "حدث خطأ غير متوقع";

        setServerError(backendError);
      } else if (error.request) {
        setServerError("لا يوجد اتصال بالخادم");
      } else {
        setServerError("حدث خطأ غير متوقع");
      }
    },
  });

  const resendMutation = useMutation({
    mutationFn: () => forgotPassword({ email, verification_method: "email" }),
    onSuccess: () => {
      setIsResending(false);
      setResendCountdown(60);
      const timer = setInterval(() => {
        setResendCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    },
    onError: () => {
      setIsResending(false);
      setServerError("فشل في إعادة إرسال الرمز");
    },
  });

  const onSubmit = (data: OtpFormData) => {
    setServerError(null);
    mutation.mutate({
      email,
      token: data.token,
      verification_method: "email",
    });
  };
  console.log("email:", email);

  const handleResendCode = () => {
    if (resendCountdown > 0) return;

    setIsResending(true);
    resendMutation.mutate();
  };

  return (
    <div className="w-full h-full flex flex-col justify-center border-0 shadow-none bg-transparent mt-14">
      <div className="space-y-2" dir="rtl">
        {serverError && (
          <div className="bg-red-100 text-red-600 border border-red-300 p-3 rounded text-right text-sm">
            {serverError}
          </div>
        )}
        <div className="text-2xl font-bold text-foreground text-right">
          تأكيد الرمز
        </div>
        <div className="text-md">
          أدخل رمز التحقق المرسل إلى بريدك الإلكتروني
        </div>
        {/* <div className="text-sm text-gray-600 text-right">{email}</div> */}
      </div>

      <div className="space-y-6 flex-1 flex flex-col justify-center">
        <form
          className="space-y-5 mt-[-20px]"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="space-y-2">
            <div className="flex justify-center" dir="ltr">
              <InputOTP
                maxLength={4}
                value={token}
                onChange={(value) =>
                  setValue("token", value, { shouldValidate: true })
                }
              >
                <InputOTPGroup className="flex gap-4">
                  {[0, 1, 2, 3].map((i) => (
                    <InputOTPSlot
                      key={i}
                      index={i}
                      className={`w-16 h-16 text-lg font-bold text-center border-2 rounded-lg
                        ${
                          token[i]
                            ? "border-[#32A88D] text-[#4B5563] bg-[#F0FDF4] "
                            : "border-gray-300 text-gray-800 "
                        }
                        focus:ring-2 focus:ring-[#32A88D] focus:border-[#32A88D] transition-all 
                      `}
                    />
                  ))}
                </InputOTPGroup>
              </InputOTP>
            </div>
            {errors.token && (
              <p className="text-sm text-red-500 text-center mt-2">
                {errors.token.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-[#32A88D] hover:bg-[#32A88D]/90 text-primary-foreground font-semibold mt-4"
            size="lg"
            disabled={!isValid || mutation.isPending}
          >
            {mutation.isPending ? "جاري التحقق..." : "تأكيد الرمز"}
          </Button>
        </form>

        <div className="space-y-2" dir="rtl">
          <p className="text-sm text-muted-foreground">
            لم تستلم الرمز؟{" "}
            <button
              type="button"
              onClick={handleResendCode}
              disabled={resendCountdown > 0 || isResending}
              className={`${
                resendCountdown > 0 || isResending
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-[#32A88D] hover:underline cursor-pointer"
              } font-medium`}
            >
              {isResending
                ? "جاري الإرسال..."
                : resendCountdown > 0
                ? `إعادة الإرسال (${resendCountdown})`
                : "إعادة إرسال الرمز"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
