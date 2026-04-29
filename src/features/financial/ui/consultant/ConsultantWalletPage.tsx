"use client";

import { useState } from "react";
import {
  DollarSign,
  Lock,
  Clock,
  CreditCard,
  ArrowDownCircle,
  FileDown,
  TrendingUp,
  Users,
  CheckCircle2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useConsultantWallet, useConsultantTransactions } from "@/features/financial/hooks";
import {
  WalletBalanceCard,
  WalletStatCard,
  FinancialEmptyInsight,
} from "../shared";
import { Sparkline } from "../shared/Sparkline";
import { ConsultantTransactionsTable } from "./components/ConsultantTransactionsTable";

export function ConsultantWalletPage() {
  const [period, setPeriod] = useState("week");

  const { data: wallet, isLoading: walletLoading } = useConsultantWallet();
  const { data: transactionsData, isLoading: isTransactionsLoading } =
    useConsultantTransactions(1, 15);

  const available = wallet?.available_balance ?? 0;
  const pending = wallet?.pending_balance ?? 0;
  const frozen = wallet?.frozen_balance ?? 0;
  const total = wallet?.total_balance ?? 0;
  const currency = wallet?.currency ?? "OMR";

  const hasHistoryData = (transactionsData?.pagination?.total ?? 0) > 0;
  const isHistoryReady = !isTransactionsLoading && !!transactionsData;
  const showInsights = isHistoryReady && hasHistoryData;
  const showFreshUserBanner = isHistoryReady && !hasHistoryData;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-8 space-y-6" dir="rtl">
      {/* ── header ── */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs text-muted-foreground mb-1">
            لوحة المستشار &rsaquo; المحفظة المالية
          </p>
          <h1 className="text-2xl font-bold text-foreground">المحفظة المالية</h1>
        </div>

        <div className="flex gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 border-border/60 text-muted-foreground"
          >
            <FileDown className="h-4 w-4" />
            تصدير كشف حساب
          </Button>
          <Button
            size="sm"
            className="gap-1.5 bg-[#32A88D] hover:bg-[#2a9278] text-white"
          >
            <ArrowDownCircle className="h-4 w-4" />
            طلب سحب
          </Button>
        </div>
      </div>

      {/* ── balance cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <WalletBalanceCard
          label="إجمالي المحفظة"
          amount={total}
          currency={currency}
          iconBg="bg-blue-100"
          icon={<DollarSign className="h-5 w-5 text-blue-600" />}
          isLoading={walletLoading}
        />
        <WalletBalanceCard
          label="رصيد مجمد"
          amount={frozen}
          currency={currency}
          iconBg="bg-purple-100"
          icon={<Lock className="h-5 w-5 text-purple-600" />}
          note="لا توجد مبالغ مجمدة"
          isLoading={walletLoading}
        />
        <WalletBalanceCard
          label="رصيد معلق"
          amount={pending}
          currency={currency}
          iconBg="bg-amber-100"
          icon={<Clock className="h-5 w-5 text-amber-600" />}
          note="لا توجد مبالغ قيد المعالجة"
          isLoading={walletLoading}
        />
        <WalletBalanceCard
          label="الرصيد المتاح للسحب"
          amount={available}
          currency={currency}
          iconBg=""
          icon={<CreditCard className="h-5 w-5 text-white" />}
          highlight
          onWithdraw={() => {}}
          isLoading={walletLoading}
        />
      </div>

      {/* ── stats + chart (only when history exists) ── */}
      {showInsights && (
        <>
          <div className="flex flex-wrap gap-3">
            <WalletStatCard
              icon={<DollarSign className="h-4 w-4 text-[#32A88D]" />}
              iconBg="bg-[#32A88D]/10"
              label="متوسط سعر الجلسة"
              value="—"
              unit={currency}
            />
            <WalletStatCard
              icon={<Users className="h-4 w-4 text-violet-600" />}
              iconBg="bg-violet-100"
              label="عملاء نشطون"
              value="—"
            />
            <WalletStatCard
              icon={<CheckCircle2 className="h-4 w-4 text-emerald-600" />}
              iconBg="bg-emerald-100"
              label="جلسات مكتملة هذا الشهر"
              value="—"
            />
          </div>

          <Separator className="opacity-50" />

          <Card className="border-0 shadow-md overflow-hidden">
            <CardContent className="p-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-foreground flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-[#32A88D]" />
                    الدخل خلال الفترة
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    مقارنة الأرباح من الجلسات بعد خصم العمولة
                  </p>
                </div>

                <Tabs value={period} onValueChange={setPeriod}>
                  <TabsList className="h-8 bg-gray-100 rounded-xl">
                    {[
                      { value: "week", label: "أسبوع" },
                      { value: "month", label: "شهر" },
                      { value: "quarter", label: "ربع" },
                      { value: "year", label: "سنة" },
                    ].map((t) => (
                      <TabsTrigger
                        key={t.value}
                        value={t.value}
                        className="text-xs h-7 px-3 rounded-lg data-[state=active]:bg-[#32A88D] data-[state=active]:text-white"
                      >
                        {t.label}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
              </div>

              <div className="flex gap-2">
                <div className="flex flex-col justify-between text-[10px] text-muted-foreground text-left w-7 py-2">
                  <span>150</span>
                  <span>113</span>
                  <span>75</span>
                  <span>38</span>
                  <span>0</span>
                </div>
                <div className="flex-1">
                  <Sparkline />
                  <div className="flex justify-between mt-1 text-[10px] text-muted-foreground">
                    {["أسبوع ١", "أسبوع ٢", "أسبوع ٣", "أسبوع ٤"].map((l) => (
                      <span key={l}>{l}</span>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* ── empty state banner (only after loading, no history) ── */}
      {showFreshUserBanner && (
        <FinancialEmptyInsight
          title="لا توجد حركات مالية بعد"
          subtitle="ستظهر إحصائيات أرباحك هنا بعد اكتمال أول جلسة مدفوعة."
        />
      )}

      <ConsultantTransactionsTable />
    </div>
  );
}
