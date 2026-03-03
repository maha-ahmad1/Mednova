"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { PaginationControls } from "@/shared/ui/components/PaginationControls";
import { TableSkeletonRows } from "@/shared/ui/components/TableSkeletonRows";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ConfirmationModal } from "@/features/control-panel/users/ui/components/ConfirmationModal";
import { useControlPanelPrograms } from "../hooks/useControlPanelPrograms";
import type { ControlPanelProgram, ProgramsFilters } from "../types/program";
import { filterAndSortPrograms } from "../utils/programs";
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

export function ProgramsManagementPage() {
  const [filters, setFilters] = useState<ProgramsFilters>(initialFilters);
  const [pendingAction, setPendingAction] = useState<PendingProgramAction>(null);

  const { programs, isLoading, isFetching, isError } = useControlPanelPrograms(filters);

  const { rows, total } = useMemo(() => filterAndSortPrograms(programs, filters), [programs, filters]);
  const totalPages = Math.max(1, Math.ceil(total / filters.limit));
  const showSkeletonRows = isLoading || isFetching;

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
            {showSkeletonRows && <TableSkeletonRows columns={8} rows={filters.limit} />}
            {!showSkeletonRows && isError && (
              <tr>
                <td colSpan={8} className="px-4 py-10 text-center text-destructive">تعذر تحميل البرامج. حاول مرة أخرى.</td>
              </tr>
            )}
            {!showSkeletonRows && !isError && rows.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-10 text-center text-muted-foreground">لا توجد برامج مطابقة.</td>
              </tr>
            )}
            {!showSkeletonRows && !isError && rows.map((program) => (
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
        currentPage={filters.page}
        lastPage={totalPages}
        total={total}
        isLoading={showSkeletonRows}
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
