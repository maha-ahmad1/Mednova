"use client";

import { useTranslations } from "next-intl";
import { Building2, Pencil, ShieldCheck } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { BankAccount } from "@/features/financial/types";

function maskIban(iban: string): string {
  if (iban.length < 8) return iban;
  const first = iban.slice(0, 4);
  const last = iban.slice(-4);
  const middleDots = "•".repeat(iban.length - 8);
  const segments = middleDots.match(/.{1,4}/g)?.join(" ") ?? middleDots;
  return `${first} ${segments} ${last}`;
}

interface BankAccountCardProps {
  account: BankAccount;
  onEdit: () => void;
}

export function BankAccountCard({ account, onEdit }: BankAccountCardProps) {
  const t = useTranslations("financial.withdraw.bankAccount");

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-8 space-y-4">
      <div>
        <p className="text-xs text-muted-foreground mb-1">{t("breadcrumb")}</p>
        <h1 className="text-2xl font-bold text-foreground">{t("displayTitle")}</h1>
        <p className="text-sm text-muted-foreground mt-1">{t("displaySubtitle")}</p>
      </div>

      <Card className="border-0 shadow-md">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Building2 className="h-4 w-4 text-[#32A88D]" />
            {t("displayTitle")}
          </CardTitle>
        </CardHeader>

        <CardContent className="px-6 pb-5 space-y-4">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-[#32A88D]/10 p-3.5 shrink-0">
              <Building2 className="h-6 w-6 text-[#32A88D]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-foreground">{account.bank_name}</p>
              <p
                className="text-[13px] font-mono text-muted-foreground truncate"
                dir="ltr"
              >
                {maskIban(account.iban)}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {account.account_holder_name}
              </p>
            </div>
            {account.is_verified && (
              <span className="flex items-center gap-1 text-xs text-[#32A88D] border border-[#32A88D]/30 rounded-full px-2.5 py-0.5 shrink-0">
                <ShieldCheck className="h-3.5 w-3.5" />
                محقق
              </span>
            )}
          </div>

          <Separator className="opacity-50" />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">
                {t("fieldAccountNumber")}
              </p>
              <p className="text-sm font-medium">{account.account_number}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">
                {t("fieldSwift")}
              </p>
              <p className="text-sm font-medium">{account.swift_code}</p>
            </div>
          </div>
        </CardContent>

        <CardFooter className="px-6 pb-5 border-t border-border/30 pt-4">
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={onEdit}
          >
            <Pencil className="h-3.5 w-3.5" />
            {t("displayEdit")}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
