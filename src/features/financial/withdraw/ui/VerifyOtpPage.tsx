"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Card, CardContent } from "@/components/ui/card";
import { FormSubmitButton } from "@/shared/ui/forms";
import { cn } from "@/lib/utils";
import { useVerifyBankOtp } from "../hooks/useVerifyBankOtp";
import { useResendBankOtp } from "../hooks/useResendBankOtp";

const otpSchema = z.object({
  otp: z.string().length(6, "يجب إدخال جميع الأرقام الستة"),
});

type OtpFormValues = z.infer<typeof otpSchema>;

export function VerifyOtpPage() {
  const t = useTranslations("financial.withdraw.otp");
  const router = useRouter();
  const [resendCountdown, setResendCountdown] = useState(60);
  const { mutateAsync, isPending } = useVerifyBankOtp();
  const { mutate: resendOtp, isPending: isResending } = useResendBankOtp();

  useEffect(() => {
    const timer = setInterval(() => {
      setResendCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const {
    setValue,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<OtpFormValues>({
    resolver: zodResolver(otpSchema),
    mode: "onChange",
    defaultValues: { otp: "" },
  });

  const otp = watch("otp");

  const onSubmit = async (values: OtpFormValues) => {
    try {
      await mutateAsync(values.otp);
      router.push("/profile/financial/bank-account");
    } catch {
      // error handled in hook via toast
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-8" dir="rtl">
      <p className="text-xs text-muted-foreground mb-6">{t("breadcrumb")}</p>

      <div className="max-w-md mx-auto">
        <Card className="border-0 shadow-md">
          <CardContent className="px-8 py-10 text-center space-y-8">
            <div className="rounded-full bg-[#32A88D]/10 p-5 w-fit mx-auto">
              <ShieldCheck className="h-10 w-10 text-[#32A88D]" />
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-foreground">{t("title")}</h1>
              <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div dir="ltr" className="flex justify-center">
                <InputOTP
                  maxLength={6}
                  value={otp}
                  onChange={(value) =>
                    setValue("otp", value, { shouldValidate: true })
                  }
                  disabled={isPending}
                >
                  <InputOTPGroup className="flex gap-3">
                    {[0, 1, 2, 3, 4, 5].map((i) => (
                      <InputOTPSlot
                        key={i}
                        index={i}
                        className={cn(
                          "w-12 h-12 text-base font-bold border-2 rounded-lg transition-all",
                          otp[i]
                            ? "border-[#32A88D] text-[#4B5563] bg-[#F0FDF4]"
                            : "border-gray-300 text-gray-800",
                        )}
                      />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
              </div>

              {errors.otp && (
                <p className="text-sm text-destructive text-center">
                  {errors.otp.message}
                </p>
              )}

              <FormSubmitButton
                isLoading={isPending}
                loadingText={t("confirmingButton")}
                size="lg"
                disabled={otp.length < 6}
                className="w-full bg-[#32A88D] hover:bg-[#2a9278] text-white"
              >
                {t("confirmButton")}
              </FormSubmitButton>
            </form>

            <p className="text-sm text-muted-foreground" dir="rtl">
              {t("resendPrompt")}{" "}
              <button
                type="button"
                disabled={resendCountdown > 0 || isResending}
                onClick={() => {
                  resendOtp();
                  setResendCountdown(60);
                }}
                className={cn(
                  "font-medium",
                  resendCountdown > 0 || isResending
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-[#32A88D] hover:underline cursor-pointer",
                )}
              >
                {resendCountdown > 0 || isResending
                  ? t("resendCooldown", { seconds: resendCountdown })
                  : t("resendButton")}
              </button>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
