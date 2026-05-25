"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  DollarSign,
  Lock,
  Clock,
  CreditCard,
  ArrowDownCircle,
  Plus,
  Eye,
  TrendingUp,
  Users,
  CheckCircle2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "@/i18n/navigation";
import { useConsultantWallet, useConsultantTransactions } from "@/features/financial/hooks";
import { useBankAccount } from "@/features/financial/withdraw/hooks/useBankAccount";
import { WithdrawRequestDialog } from "@/features/financial/withdraw/ui/WithdrawRequestDialog";
import {
  WalletBalanceCard,
  WalletStatCard,
  FinancialEmptyInsight,
} from "../shared";
import { Sparkline } from "../shared/Sparkline";
import { ConsultantTransactionsTable } from "./components/ConsultantTransactionsTable";
import { WithdrawalsTable } from "@/features/financial/withdraw/ui/WithdrawalsTable";

type TableTab = "transactions" | "withdrawals";

export function ConsultantWalletPage() {
  const t = useTranslations("financial");
  const router = useRouter();
  const [period, setPeriod] = useState("week");
  const [withdrawDialogOpen, setWithdrawDialogOpen] = useState(false);
  const [tableTab, setTableTab] = useState<TableTab>("transactions");

  const { data: wallet, isLoading: walletLoading } = useConsultantWallet();
  const { data: bankAccount } = useBankAccount();
  const { data: transactionsData, isLoading: isTransactionsLoading } =
    useConsultantTransactions(1, 15);

  const handleWithdraw = () => {
    if (!bankAccount || !bankAccount.is_verified) {
      router.push("/profile/financial/bank-account");
      return;
    }
    setWithdrawDialogOpen(true);
  };

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
            {t("consultant.breadcrumb")}
          </p>
          <h1 className="text-2xl font-bold text-foreground">{t("consultant.title")}</h1>
        </div>

        <div className="flex gap-2 flex-wrap">
          {!bankAccount ? (
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 border-border/60 text-muted-foreground"
              onClick={() => router.push("/profile/financial/bank-account")}
            >
              <Plus className="h-4 w-4" />
              {t("shared.addBankAccount")}
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 border-border/60 text-muted-foreground"
              onClick={() => router.push("/profile/financial/bank-account")}
            >
              <Eye className="h-4 w-4" />
              {t("shared.viewBankAccount")}
            </Button>
          )}
          <Button
            size="sm"
            onClick={handleWithdraw}
            className="gap-1.5 bg-[#32A88D] hover:bg-[#2a9278] text-white"
          >
            <ArrowDownCircle className="h-4 w-4" />
            {t("shared.withdrawalRequest")}
          </Button>
        </div>
      </div>

      {/* ── balance cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <WalletBalanceCard
          label={t("consultant.totalWallet")}
          amount={total}
          currency={currency}
          iconBg="bg-blue-100"
          icon={<DollarSign className="h-5 w-5 text-blue-600" />}
          isLoading={walletLoading}
        />
        <WalletBalanceCard
          label={t("consultant.frozenBalance")}
          amount={frozen}
          currency={currency}
          iconBg="bg-purple-100"
          icon={<Lock className="h-5 w-5 text-purple-600" />}
          note={t("consultant.noFrozenAmounts")}
          isLoading={walletLoading}
        />
        <WalletBalanceCard
          label={t("consultant.pendingBalance")}
          amount={pending}
          currency={currency}
          iconBg="bg-amber-100"
          icon={<Clock className="h-5 w-5 text-amber-600" />}
          note={t("consultant.noPendingAmounts")}
          isLoading={walletLoading}
        />
        <WalletBalanceCard
          label={t("consultant.withdrawableBalance")}
          amount={available}
          currency={currency}
          iconBg=""
          icon={<CreditCard className="h-5 w-5 text-white" />}
          highlight
          onWithdraw={handleWithdraw}
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
              label={t("consultant.avgSessionPrice")}
              value="—"
              unit={currency}
            />
            <WalletStatCard
              icon={<Users className="h-4 w-4 text-violet-600" />}
              iconBg="bg-violet-100"
              label={t("consultant.activeClients")}
              value="—"
            />
            <WalletStatCard
              icon={<CheckCircle2 className="h-4 w-4 text-emerald-600" />}
              iconBg="bg-emerald-100"
              label={t("consultant.completedSessionsMonth")}
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
                    {t("consultant.incomeTitle")}
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    {t("consultant.incomeSubtitle")}
                  </p>
                </div>

                <Tabs value={period} onValueChange={setPeriod}>
                  <TabsList className="h-8 bg-gray-100 rounded-xl">
                    {[
                      { value: "week", label: t("shared.periodWeek") },
                      { value: "month", label: t("shared.periodMonth") },
                      { value: "quarter", label: t("shared.periodQuarter") },
                      { value: "year", label: t("shared.periodYear") },
                    ].map((tab) => (
                      <TabsTrigger
                        key={tab.value}
                        value={tab.value}
                        className="text-xs h-7 px-3 rounded-lg data-[state=active]:bg-[#32A88D] data-[state=active]:text-white"
                      >
                        {tab.label}
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
                    {[
                      t("shared.chartWeek1"),
                      t("shared.chartWeek2"),
                      t("shared.chartWeek3"),
                      t("shared.chartWeek4"),
                    ].map((l) => (
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
          title={t("consultant.noTransactionsTitle")}
          subtitle={t("consultant.noTransactionsSubtitle")}
        />
      )}

      {/* ── operations table with tabs ── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h2 className="font-semibold text-foreground text-base">
            {t("consultant.operationsLog")}
          </h2>
          <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
            <button
              onClick={() => setTableTab("transactions")}
              className={`flex items-center gap-1.5 text-xs px-4 py-1.5 rounded-lg font-medium transition-colors ${
                tableTab === "transactions"
                  ? "bg-[#32A88D] text-white shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <TrendingUp className="h-3.5 w-3.5" />
              {t("consultant.tabs.transactions")}
            </button>
            <button
              onClick={() => setTableTab("withdrawals")}
              className={`flex items-center gap-1.5 text-xs px-4 py-1.5 rounded-lg font-medium transition-colors ${
                tableTab === "withdrawals"
                  ? "bg-[#32A88D] text-white shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <ArrowDownCircle className="h-3.5 w-3.5" />
              {t("consultant.tabs.withdrawals")}
            </button>
          </div>
        </div>

        {tableTab === "transactions" && <ConsultantTransactionsTable />}
        {tableTab === "withdrawals" && <WithdrawalsTable />}
      </div>

      {wallet && bankAccount && (
        <WithdrawRequestDialog
          open={withdrawDialogOpen}
          onOpenChange={setWithdrawDialogOpen}
          wallet={wallet}
          bankAccount={bankAccount}
        />
      )}
    </div>
  );
}
