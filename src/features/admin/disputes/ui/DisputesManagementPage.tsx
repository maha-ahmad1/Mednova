"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PaginationControls } from "@/shared/ui/components/PaginationControls";
import { useAdminDisputes } from "../hooks/useAdminDisputes";
import { DisputeSummaryCards } from "./components/DisputeSummaryCards";
import { DisputesTable } from "./components/DisputesTable";
import type { DisputeStatus } from "../types";

type StatusTab = DisputeStatus | "all";

const tabs: { value: StatusTab; label: string }[] = [
  { value: "all", label: "الكل" },
  { value: "opened", label: "مفتوحة" },
  { value: "resolved", label: "محلولة" },
];

export function DisputesManagementPage() {
  const [activeTab, setActiveTab] = useState<StatusTab>("all");
  const [page, setPage] = useState(1);

  const { disputes, summary, pagination, isLoading, isFetching } = useAdminDisputes(
    activeTab,
    page,
  );

  const handleTabChange = (value: string) => {
    setActiveTab(value as StatusTab);
    setPage(1);
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">إدارة النزاعات</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          مراجعة وحل النزاعات المالية المفتوحة
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} dir="rtl">
        <TabsList className="h-auto w-full justify-start overflow-x-auto rounded-xl border bg-muted/40 p-1">
          {tabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value} className="px-5 py-2">
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <DisputeSummaryCards
        totalFrozenAmount={summary?.total_frozen_amount ?? "0"}
        totalOpen={summary?.total_open ?? 0}
        totalResolved={summary?.total_resolved ?? 0}
        isLoading={isLoading}
      />

      <DisputesTable disputes={disputes} isLoading={isLoading} isFetching={isFetching} />

      <PaginationControls
        currentPage={pagination?.current_page ?? page}
        lastPage={pagination?.last_page ?? 1}
        total={pagination?.total}
        isLoading={isLoading || isFetching}
        onPageChange={(p) => {
          if (p < 1 || p > (pagination?.last_page ?? 1)) return;
          setPage(p);
        }}
      />
    </div>
  );
}
