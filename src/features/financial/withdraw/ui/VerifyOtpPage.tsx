"use client";

import { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { useNavigationLoader } from "@/hooks/useNavigationLoader";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { FormSubmitButton } from "@/shared/ui/forms";
import { cn } from "@/lib/utils";
import { useVerifyBankOtp } from "../hooks/useVerifyBankOtp";
import { useResendBankOtp } from "../hooks/useResendBankOtp";

const createOtpSchema = (otpIncompleteMessage: string) =>
  z.object({
    otp: z.string().length(6, otpIncompleteMessage),
  });

type OtpFormValues = z.infer<ReturnType<typeof createOtpSchema>>;

export function VerifyOtpPage() {
  const t = useTranslations("financial.withdraw.otp");
  const otpSchema = useMemo(() => createOtpSchema(t("otpIncomplete")), [t]);
  const { push } = useNavigationLoader();
  const [resendCountdown, setResendCountdown] = useState(60);
  const { mutateAsync, isPending } = useVerifyBankOtp();
  const { mutate: resendOtp, isPending: isResending } = useResendBankOtp();

  useEffect(() => {
    const timer = setInterval(() => {
      setResendCountdown((prev) => (prev <= 1 ? 0 : prev - 1));
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
      push("/profile/financial/bank-account");
    } catch {
      // error handled in hook via toast
    }
  };

  return (
    <div className="md:max-w-5xl md:mx-auto md:px-8">
      <p className="hidden md:block text-xs text-muted-foreground mb-6">
        {t("breadcrumb")}
      </p>

      <div className="md:max-w-md md:mx-auto">
        <div className="bg-white md:rounded-2xl md:border md:shadow-sm">
          <div className="pt-4 pb-28 md:px-8 md:py-10 md:pb-10 text-center space-y-6 md:space-y-8">
            <div className="rounded-full bg-[#32A88D]/10 p-4 md:p-5 w-fit mx-auto">
              <ShieldCheck className="h-8 w-8 md:h-10 md:w-10 text-[#32A88D]" />
            </div>

            <div className="space-y-2">
              <h1 className="text-xl md:text-2xl font-bold text-foreground">
                {t("title")}
              </h1>
              <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div dir="ltr" className="w-full">
                <InputOTP
                  maxLength={6}
                  value={otp}
                  onChange={(value) =>
                    setValue("otp", value, { shouldValidate: true })
                  }
                  disabled={isPending}
                  autoFocus
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  pattern={REGEXP_ONLY_DIGITS}
                  containerClassName="w-full"
                >
                  <InputOTPGroup className="flex w-full gap-2">
                    {[0, 1, 2, 3, 4, 5].map((i) => (
                      <InputOTPSlot
                        key={i}
                        index={i}
                        className={cn(
                          "flex-1 aspect-square max-w-14 min-h-11 text-base font-bold border-2 rounded-lg transition-all",
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

              <div className="fixed inset-x-0 bottom-[calc(4rem+env(safe-area-inset-bottom))] z-40 bg-white px-4 pb-3 pt-3 border-t border-gray-100 md:static md:inset-auto md:z-auto md:bg-transparent md:border-0 md:p-0">
                <FormSubmitButton
                  isLoading={isPending}
                  loadingText={t("confirmingButton")}
                  size="lg"
                  disabled={otp.length < 6}
                  className="w-full min-h-11 bg-[#32A88D] hover:bg-[#2a9278] text-white"
                >
                  {t("confirmButton")}
                </FormSubmitButton>
              </div>
            </form>

            <p className="text-sm text-muted-foreground">
              {t("resendPrompt")}{" "}
              <button
                type="button"
                disabled={resendCountdown > 0 || isResending}
                onClick={() => {
                  resendOtp(undefined, {
                    onSuccess: () => setResendCountdown(60),
                  });
                }}
                className={cn(
                  "font-medium inline-flex min-h-11 items-center",
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
          </div>
        </div>
      </div>
    </div>
  );
}
