"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ConfirmationModal } from "@/features/control-panel/users/ui/components/ConfirmationModal";
import { PaginationControls } from "@/shared/ui/components/PaginationControls";
import { useControlPanelPrograms } from "../hooks/useControlPanelPrograms";
import type { ControlPanelProgram, ProgramsFilters } from "../types/program";
import { filterAndSortPrograms, paginatePrograms } from "../utils/programs";
import { ProgramRow } from "./components/ProgramRow";
import { ProgramsTableFilters } from "./components/ProgramsTableFilters";

type PendingProgramAction = { type: "approve" | "delete" | "edit"; program: ControlPanelProgram } | null;

const initialFilters: ProgramsFilters = {
  search: "",
  status: "all",
  approval: "all",
  sortBy: "id",
  sortOrder: "desc",
  page: 1,
  limit: 10,
};

const SKELETON_ROWS_COUNT = 10;

export function ProgramsManagementPage() {
  const [filters, setFilters] = useState<ProgramsFilters>(initialFilters);
  const [pendingAction, setPendingAction] = useState<PendingProgramAction>(null);

  const { programs, pagination, isLoading, isFetching, isError } = useControlPanelPrograms(filters);

  const { rows: sortedRows, total: localTotal } = useMemo(() => filterAndSortPrograms(programs, filters), [programs, filters]);
  const rows = useMemo(() => {
    if (pagination) {
      return sortedRows;
    }

    return paginatePrograms(sortedRows, filters.page, filters.limit);
  }, [filters.limit, filters.page, pagination, sortedRows]);

  const total = pagination?.total ?? localTotal;
  const currentPage = pagination?.current_page ?? filters.page;
  const totalPages = pagination?.last_page ?? Math.max(1, Math.ceil(localTotal / filters.limit));

  const onConfirmAction = () => {
    if (!pendingAction) return;

    if (pendingAction.type === "approve") {
      toast.success(`تمت الموافقة على البرنامج: ${pendingAction.program.title}`);
    } else if (pendingAction.type === "delete") {
      toast.success(`تم حذف البرنامج: ${pendingAction.program.title}`);
    } else {
      toast.info(`فتح تعديل البرنامج: ${pendingAction.program.title}`);
    }

    setPendingAction(null);
  };

  return (
    <div className="mx-auto w-full max-w-7xl space-y-5 p-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold text-foreground">إدارة البرامج</h1>
        <p className="text-sm text-muted-foreground">إدارة البرامج وحالات النشر والموافقة من لوحة التحكم.</p>
      </div>

      <ProgramsTableFilters filters={filters} onChange={setFilters} />

      <div className="flex items-center justify-between rounded-lg border bg-white p-3">
        <p className="text-sm text-muted-foreground">إجمالي البرامج: {total}</p>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">عدد العناصر</span>
          <Select
            value={String(filters.limit)}
            onValueChange={(value) => setFilters((prev) => ({ ...prev, limit: Number(value), page: 1 }))}
          >
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[10, 20, 50].map((size) => (
                <SelectItem key={size} value={String(size)}>{size}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted/40 text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">ID</th>
              <th className="px-4 py-3 font-medium">العنوان</th>
              <th className="px-4 py-3 font-medium">المنشئ</th>
              <th className="px-4 py-3 font-medium">الحالة</th>
              <th className="px-4 py-3 font-medium">الموافقة</th>
              <th className="px-4 py-3 font-medium">السعر</th>
              <th className="px-4 py-3 font-medium">العملة</th>
              <th className="px-4 py-3 font-medium">الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {(isLoading || isFetching) &&
              Array.from({ length: SKELETON_ROWS_COUNT }).map((_, index) => (
                <tr key={`programs-skeleton-${index}`} className="border-t align-middle">
                  <td className="px-4 py-3"><Skeleton className="h-4 w-10" /></td>
                  <td className="px-4 py-3"><Skeleton className="h-4 w-40" /></td>
                  <td className="px-4 py-3"><Skeleton className="h-4 w-28" /></td>
                  <td className="px-4 py-3"><Skeleton className="h-6 w-20" /></td>
                  <td className="px-4 py-3"><Skeleton className="h-6 w-24" /></td>
                  <td className="px-4 py-3"><Skeleton className="h-4 w-16" /></td>
                  <td className="px-4 py-3"><Skeleton className="h-4 w-12" /></td>
                  <td className="px-4 py-3"><Skeleton className="h-8 w-10" /></td>
                </tr>
              ))}
            {!isLoading && !isFetching && isError && (
              <tr>
                <td colSpan={8} className="px-4 py-10 text-center text-destructive">تعذر تحميل البرامج. حاول مرة أخرى.</td>
              </tr>
            )}
            {!isLoading && !isFetching && !isError && rows.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-10 text-center text-muted-foreground">لا توجد برامج مطابقة.</td>
              </tr>
            )}
            {!isLoading && !isFetching && !isError && rows.map((program) => (
              <ProgramRow
                key={program.id}
                program={program}
                onEdit={() => setPendingAction({ type: "edit", program })}
                onDelete={() => setPendingAction({ type: "delete", program })}
                onApprove={() => setPendingAction({ type: "approve", program })}
              />
            ))}
          </tbody>
        </table>
      </div>

      <PaginationControls
        currentPage={currentPage}
        lastPage={totalPages}
        total={total}
        isLoading={isLoading || isFetching}
        onPageChange={(page) => {
          if (page < 1 || page > totalPages) {
            return;
          }

          setFilters((prev) => ({ ...prev, page }));
        }}
      />

      <ConfirmationModal
        open={Boolean(pendingAction)}
        title="تأكيد الإجراء"
        description="هل أنت متأكد أنك تريد تنفيذ هذا الإجراء على البرنامج؟"
        confirmLabel="تأكيد"
        cancelLabel="إلغاء"
        onConfirm={onConfirmAction}
        onOpenChange={(open) => !open && setPendingAction(null)}
      />
    </div>
  );
}
