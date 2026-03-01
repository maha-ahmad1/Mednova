"use client";

import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/shared/ui/components/EmptyState";
import { useAdminPrograms } from "../hooks/useAdminPrograms";
import type { ProgramManagementFilters, ProgramStatus } from "../types/program";
import { ProgramManagementCard } from "./components/ProgramManagementCard";
import { ProgramsFilters } from "./components/ProgramsFilters";

const defaultFilters: ProgramManagementFilters = {
  limit: 1,
  status: "",
  isApproved: 0,
};

export function ProgramsManagementPage() {
  const [filters, setFilters] = useState<ProgramManagementFilters>(defaultFilters);
  const { data, isLoading, isError, refetch } = useAdminPrograms(filters);

  const programs = data ?? [];

  const handleStatusChange = (status: ProgramStatus | "") => {
    setFilters((prev) => ({ ...prev, status }));
  };

  if (isLoading) {
    return (
      <section className="space-y-6 p-6">
        <Skeleton className="h-24 w-full rounded-xl" />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-80 w-full rounded-2xl" />
          ))}
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <EmptyState
        type="error"
        title="حدث خطأ"
        description="تعذر تحميل البرامج"
        actionText="إعادة المحاولة"
        onAction={() => refetch()}
        className="py-10"
      />
    );
  }

  return (
    <section className="space-y-6 p-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold text-slate-900">إدارة البرامج</h1>
        <p className="text-sm text-slate-600">عرض البرامج غير المعتمدة مع إمكانية التصفية حسب الحالة.</p>
      </header>

      <ProgramsFilters filters={filters} onStatusChange={handleStatusChange} />

      {programs.length === 0 ? (
        <EmptyState
          type="no-data"
          title="لا توجد برامج"
          description="لا يوجد برامج مطابقة للفلترة الحالية"
          className="py-10"
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {programs.map((program) => (
            <ProgramManagementCard
              key={program.id}
              title={program.title}
              description={program.description}
              coverImage={program.cover_image}
              price={program.price}
              currency={program.currency}
              status={program.status}
              isApproved={program.is_approved}
            />
          ))}
        </div>
      )}
    </section>
  );
}
