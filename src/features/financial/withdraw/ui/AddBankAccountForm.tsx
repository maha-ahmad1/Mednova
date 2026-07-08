"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMemo } from "react";
import { Info, CheckCircle2 } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { useNavigationLoader } from "@/hooks/useNavigationLoader";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { FormInput, FormSubmitButton } from "@/shared/ui/forms";
import { cn } from "@/lib/utils";
import { useAddBankAccount } from "../hooks/useAddBankAccount";
import { useUpdateBankAccount } from "../hooks/useUpdateBankAccount";
import type { BankAccount } from "@/features/financial/types";

type BankAccountValidationMessages = {
  bankNameRequired: string;
  accountHolderRequired: string;
  accountNumberRequired: string;
  ibanInvalid: string;
  swiftRequired: string;
  swiftTooLong: string;
};

const createBankAccountSchema = (messages: BankAccountValidationMessages) =>
  z.object({
    bank_name: z.string().min(1, messages.bankNameRequired),
    account_holder_name: z.string().min(3, messages.accountHolderRequired),
    account_number: z.string().min(5, messages.accountNumberRequired),
    iban: z.string().regex(/^OM\d{21}$/, messages.ibanInvalid),
    swift_code: z
      .string()
      .min(8, messages.swiftRequired)
      .max(11, messages.swiftTooLong),
  });

type BankAccountFormValues = z.infer<ReturnType<typeof createBankAccountSchema>>;

interface AddBankAccountFormProps {
  onCancel?: () => void;
  existingAccount?: BankAccount;
}

export function AddBankAccountForm({ onCancel, existingAccount }: AddBankAccountFormProps) {
  const t = useTranslations("financial.withdraw.bankAccount");
  const locale = useLocale();
  const isRtl = locale === "ar";
  const { push, back } = useNavigationLoader();
  const addMutation = useAddBankAccount();
  const updateMutation = useUpdateBankAccount();
  const { mutateAsync, isPending } = existingAccount ? updateMutation : addMutation;

  const bankAccountSchema = useMemo(
    () =>
      createBankAccountSchema({
        bankNameRequired: t("validation.bankNameRequired"),
        accountHolderRequired: t("validation.accountHolderRequired"),
        accountNumberRequired: t("validation.accountNumberRequired"),
        ibanInvalid: t("validation.ibanInvalid"),
        swiftRequired: t("validation.swiftRequired"),
        swiftTooLong: t("validation.swiftTooLong"),
      }),
    [t],
  );

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<BankAccountFormValues>({
    resolver: zodResolver(bankAccountSchema),
    mode: "onChange",
    defaultValues: existingAccount
      ? {
          bank_name: existingAccount.bank_name,
          account_holder_name: existingAccount.account_holder_name,
          account_number: existingAccount.account_number,
          iban: existingAccount.iban,
          swift_code: existingAccount.swift_code,
        }
      : undefined,
  });

  const ibanValue = watch("iban") ?? "";
  const isIbanValid = /^OM\d{21}$/.test(ibanValue);
  const isIbanTouched = ibanValue.length > 0;

  const onSubmit = async (values: BankAccountFormValues) => {
    try {
      await mutateAsync({ ...values, bank_country: "OM" });
      push("/profile/financial/bank-account/verify");
    } catch {
      // error handled in hook via toast
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-8 space-y-4">
      <div>
        <p className="text-xs text-muted-foreground mb-1">{t("breadcrumb")}</p>
        <h1 className="text-2xl font-bold text-foreground">{t("title")}</h1>
        <p className="text-sm text-muted-foreground mt-1">{t("subtitle")}</p>
      </div>

      <Card className="border-0 shadow-md">
        <CardContent className="p-6 space-y-5">
          <div className="flex items-start gap-3 rounded-lg border border-[#32A88D]/30 bg-[#32A88D]/5 px-4 py-3">
            <Info className="h-4 w-4 text-[#32A88D] mt-0.5 shrink-0" />
            <p className="text-sm text-[#32A88D]">{t("infoBanner")}</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormInput
                label={t("fieldBank")}
                placeholder={t("fieldBankPlaceholder")}
                rtl={isRtl}
                error={errors.bank_name?.message}
                {...register("bank_name")}
              />

              <div className="space-y-2">
                <Label className="block text-sm font-medium">{t("fieldCountry")}</Label>
                <Input
                  value={t("countryValue")}
                  readOnly
                  dir={isRtl ? "rtl" : "ltr"}
                  className="p-6 cursor-not-drop bg-[#32A88D]/10 text-gray-700 border-transparent"
                />
              </div>
            </div>

            <div className="space-y-1">
              <FormInput
                label={t("fieldAccountHolder")}
                placeholder={t("fieldAccountHolderPlaceholder")}
                rtl={isRtl}
                error={errors.account_holder_name?.message}
                {...register("account_holder_name")}
              />
              <p className="text-xs text-muted-foreground me-1">
                {t("fieldAccountHolderHint")}
              </p>
            </div>

            <FormInput
              label={t("fieldAccountNumber")}
              placeholder={t("fieldAccountNumberPlaceholder")}
              inputMode="numeric"
              rtl={isRtl}
              error={errors.account_number?.message}
              {...register("account_number")}
            />

            <div className="space-y-1">
              <Label className="block text-sm font-medium">{t("fieldIban")}</Label>
              <Input
                placeholder={t("fieldIbanPlaceholder")}
                dir="ltr"
                className={cn(
                  "p-6 text-left",
                  errors.iban && "border-destructive focus-visible:ring-destructive",
                )}
                {...register("iban")}
              />
              <div className="min-h-[18px]">
                {isIbanTouched && isIbanValid ? (
                  <p className="text-xs text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    {t("ibanValid")}
                  </p>
                ) : errors.iban ? (
                  <p className="text-sm text-destructive text-start">
                    {errors.iban.message}
                  </p>
                ) : (
                  <p className="text-xs text-muted-foreground text-start">
                    {t("fieldIbanHint")}
                  </p>
                )}
              </div>
            </div>

            <FormInput
              label={t("fieldSwift")}
              placeholder={t("fieldSwiftPlaceholder")}
              rtl={isRtl}
              error={errors.swift_code?.message}
              {...register("swift_code")}
            />

            <div className="flex gap-3 pt-2">
              <FormSubmitButton
                isLoading={isPending}
                loadingText={t("savingButton")}
                disabled={!isValid}
                align="center"
                className="flex-1 bg-[#32A88D] hover:bg-[#2a9278] text-white"
              >
                {t("submitButton")}
              </FormSubmitButton>
              <button
                type="button"
                onClick={() => (onCancel ? onCancel() : back())}
                disabled={isPending}
                className="px-6 py-2 text-sm text-muted-foreground border border-border rounded-md hover:bg-muted/40 transition-colors disabled:opacity-50"
              >
                {t("cancelButton")}
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
