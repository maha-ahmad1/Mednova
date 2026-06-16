"use client";

import { useState } from "react";
import { useNavigationLoader } from "@/hooks/useNavigationLoader";
import { useTranslations } from "next-intl";
import { Skeleton } from "@/components/ui/skeleton";
import { ShieldAlert, Landmark } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoadingButton } from "@/shared/ui/LoadingButton";
import { useBankAccount } from "../hooks/useBankAccount";
import { AddBankAccountForm } from "./AddBankAccountForm";
import { BankAccountCard } from "./BankAccountCard";

export function BankAccountSection() {
  const t = useTranslations("financial.withdraw");
  const { push, isNavigating } = useNavigationLoader();
  const { data: bankAccount, isLoading, isFetching } = useBankAccount();
  const [editMode, setEditMode] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // Wait for any in-flight fetch to settle before making routing decisions
  if (isLoading || isFetching) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-8 space-y-4" dir="rtl">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-80" />
        <Skeleton className="h-10 w-full rounded-lg" />
        <Skeleton className="h-48 w-full rounded-xl" />
      </div>
    );
  }

  // Data is settled — show CTA instead of auto-redirecting to avoid loops
  if (bankAccount && !bankAccount.is_verified) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-8 space-y-4" dir="rtl">
        <Card className="border-0 shadow-md">
          <CardContent className="p-6 flex flex-col items-center gap-4 text-center">
            <div className="rounded-full bg-amber-100 p-4">
              <ShieldAlert className="h-7 w-7 text-amber-600" />
            </div>
            <div>
              <p className="font-semibold text-foreground">يرجى تأكيد حسابك البنكي</p>
              <p className="text-sm text-muted-foreground mt-1">
                لإكمال إضافة الحساب البنكي، يرجى إدخال رمز التحقق.
              </p>
            </div>
            <LoadingButton
              onClick={() => push("/profile/financial/bank-account/verify")}
              isLoading={isNavigating}
              loadingText="جارٍ الانتقال..."
              className="bg-[#32A88D] hover:bg-[#2a9278] text-white"
            >
              متابعة التحقق
            </LoadingButton>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (bankAccount && !editMode) {
    return (
      <BankAccountCard
        account={bankAccount}
        onEdit={() => setEditMode(true)}
      />
    );
  }

  if (bankAccount && editMode) {
    return <AddBankAccountForm existingAccount={bankAccount} onCancel={() => setEditMode(false)} />;
  }

  // No bank account — show empty state or the add form
  if (!showForm) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-8" dir="rtl">
        <Card className="border-0 shadow-md">
          <CardContent className="p-8 flex flex-col items-center gap-4 text-center">
            <div className="rounded-full bg-[#32A88D]/10 p-5">
              <Landmark className="h-10 w-10 text-[#32A88D]" />
            </div>
            <div>
              <p className="font-semibold text-foreground">
                {t("bankAccount.emptyStateTitle")}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {t("bankAccount.emptyStateDescription")}
              </p>
            </div>
            <Button
              onClick={() => setShowForm(true)}
              className="bg-[#32A88D] hover:bg-[#2a9278] text-white"
            >
              {t("bankAccount.emptyStateButton")}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <AddBankAccountForm onCancel={() => setShowForm(false)} />;
}
