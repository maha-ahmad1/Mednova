"use client";

import { useTranslations } from "next-intl";
import {
  LayoutDashboard,
  TrendingUp,
  ShieldCheck,
  ArrowLeftRight,
  Banknote,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardCards } from "./components/DashboardCards";
import { RevenueTable } from "./components/RevenueTable";
import { EscrowTable } from "./components/EscrowTable";
import { TransactionsTable } from "./components/TransactionsTable";
import { WithdrawalsTable } from "./components/WithdrawalsTable";

// Active tab: brand green bg + white text; inactive: muted text, hover to foreground
const TAB_TRIGGER =
  "flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-150" +
  " data-[state=active]:bg-[#32A88D] data-[state=active]:text-white data-[state=active]:shadow-sm" +
  " data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:text-foreground";

export function AdminFinancialPage() {
  const t = useTranslations("controlPanel.financial");

  return (
    // Explicit dir="rtl" ensures shadcn Tabs and all inner components honour RTL
    // even if a parent's dir attribute is not cascading via CSS.
    <div dir="rtl" className="mx-auto w-full max-w-7xl space-y-6">

      {/* Page header — matches users / programs pages */}
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold text-foreground">
          {t("pageTitle")}
        </h1>
        <p className="text-sm text-muted-foreground">{t("pageSubtitle")}</p>
      </div>

      {/* Main tab bar + content */}
      <Tabs defaultValue="overview" dir="rtl" className="space-y-5">
        {/*
          TabsList: white card, RTL flex row.
          In RTL the tabs render right → left so "نظرة عامة" appears on the far right.
          overflow-x-auto keeps it scrollable on narrow screens without wrapping.
        */}
        <TabsList className="h-auto w-full sm:w-auto flex gap-1 p-1 bg-white border border-border/60 rounded-xl shadow-sm overflow-x-auto">
          <TabsTrigger value="overview" className={TAB_TRIGGER}>
            <LayoutDashboard className="h-3.5 w-3.5 shrink-0" />
            {t("tabs.overview")}
          </TabsTrigger>
          <TabsTrigger value="revenue" className={TAB_TRIGGER}>
            <TrendingUp className="h-3.5 w-3.5 shrink-0" />
            {t("tabs.revenue")}
          </TabsTrigger>
          <TabsTrigger value="escrow" className={TAB_TRIGGER}>
            <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
            {t("tabs.escrow")}
          </TabsTrigger>
          <TabsTrigger value="transactions" className={TAB_TRIGGER}>
            <ArrowLeftRight className="h-3.5 w-3.5 shrink-0" />
            {t("tabs.transactions")}
          </TabsTrigger>
          <TabsTrigger value="withdrawals" className={TAB_TRIGGER}>
            <Banknote className="h-3.5 w-3.5 shrink-0" />
            {t("tabs.withdrawals")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-0">
          <DashboardCards />
        </TabsContent>

        <TabsContent value="revenue" className="mt-0">
          <RevenueTable />
        </TabsContent>

        <TabsContent value="escrow" className="mt-0">
          <EscrowTable />
        </TabsContent>

        <TabsContent value="transactions" className="mt-0">
          <TransactionsTable />
        </TabsContent>

        <TabsContent value="withdrawals" className="mt-0">
          <WithdrawalsTable />
        </TabsContent>
      </Tabs>
    </div>
  );
}
