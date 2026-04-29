"use client";

import { useState } from "react";
import {
  DollarSign,
  Clock,
  Wallet,
  ArrowDownCircle,
  FileDown,
  TrendingUp,
  Receipt,
  RefreshCcw,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { usePatientWallet, usePatientPayments } from "@/features/financial/hooks";
import {
  WalletBalanceCard,
  WalletStatCard,
  FinancialEmptyInsight,
} from "../shared";
import { Sparkline } from "../shared/Sparkline";
// import { PatientPaymentsTable } from "./PatientPaymentsTable";
// import { PatientTransactionsTable } from "./PatientTransactionsTable";
import { PatientPaymentsTable } from "./components/PatientPaymentsTable";
import { PatientTransactionsTable } from "./components/PatientTransactionsTable";


type ActiveTab = "payments" | "transactions";

export function PatientWalletPage() {
  const [period, setPeriod] = useState("week");
  const [activeTab, setActiveTab] = useState<ActiveTab>("payments");

  const { data: wallet, isLoading: walletLoading } = usePatientWallet();
  const { data: paymentsData, isLoading: isPaymentsLoading } =
    usePatientPayments(1, 15);

  const withdrawable = wallet?.withdrawable_balance ?? 0;
  const total = wallet?.total_balance ?? 0;
  const available = wallet?.available_balance ?? 0;
  const pendingWithdrawal = wallet?.pending_withdrawal ?? 0;
  const currency = wallet?.currency ?? "OMR";

  const hasPaymentData = (paymentsData?.pagination?.total ?? 0) > 0;
  const isPaymentHistoryReady = !isPaymentsLoading && !!paymentsData;
  const showInsights = isPaymentHistoryReady && hasPaymentData;
  const showFreshUserBanner = isPaymentHistoryReady && !hasPaymentData;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-8 space-y-6" dir="rtl">
      {/* ── header ── */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs text-muted-foreground mb-1">
            حسابي &rsaquo; المحفظة المالية
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
          label="الرصيد المتاح"
          amount={available}
          currency={currency}
          iconBg="bg-emerald-100"
          icon={<Wallet className="h-5 w-5 text-emerald-600" />}
          isLoading={walletLoading}
        />
        <WalletBalanceCard
          label="قيد السحب"
          amount={pendingWithdrawal}
          currency={currency}
          iconBg="bg-amber-100"
          icon={<Clock className="h-5 w-5 text-amber-600" />}
          note="لا توجد مبالغ قيد السحب"
          isLoading={walletLoading}
        />
        <WalletBalanceCard
          label="الرصيد القابل للسحب"
          amount={withdrawable}
          currency={currency}
          iconBg=""
          icon={<ArrowDownCircle className="h-5 w-5 text-white" />}
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
              label="إجمالي المدفوعات"
              value="—"
              unit={currency}
            />
            <WalletStatCard
              icon={<Receipt className="h-4 w-4 text-violet-600" />}
              iconBg="bg-violet-100"
              label="عدد المدفوعات"
              value="—"
            />
            <WalletStatCard
              icon={<RefreshCcw className="h-4 w-4 text-sky-600" />}
              iconBg="bg-sky-100"
              label="المبالغ المسترجعة"
              value="—"
              unit={currency}
            />
          </div>

          <Separator className="opacity-50" />

          <Card className="border-0 shadow-md overflow-hidden">
            <CardContent className="p-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-foreground flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-[#32A88D]" />
                    المدفوعات خلال الفترة
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    متابعة مدفوعاتك داخل المنصة
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
          title="لا توجد معاملات مالية بعد"
          subtitle="ستظهر إحصائياتك ومدفوعاتك هنا فور إتمام أول استشارة."
        />
      )}

      {/* ── operations table with tabs ── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h2 className="font-semibold text-foreground text-base">سجل العمليات</h2>

          <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
            <button
              onClick={() => setActiveTab("payments")}
              className={`flex items-center gap-1.5 text-xs px-4 py-1.5 rounded-lg font-medium transition-colors ${
                activeTab === "payments"
                  ? "bg-[#32A88D] text-white shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Receipt className="h-3.5 w-3.5" />
              المدفوعات
            </button>
            <button
              onClick={() => setActiveTab("transactions")}
              className={`flex items-center gap-1.5 text-xs px-4 py-1.5 rounded-lg font-medium transition-colors ${
                activeTab === "transactions"
                  ? "bg-[#32A88D] text-white shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <TrendingUp className="h-3.5 w-3.5" />
              الحركات المالية
            </button>
          </div>
        </div>

        {activeTab === "payments" && <PatientPaymentsTable />}
        {activeTab === "transactions" && <PatientTransactionsTable />}
      </div>
    </div>
  );
}
