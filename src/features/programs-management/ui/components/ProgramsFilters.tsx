"use client";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ProgramManagementFilters, ProgramStatus } from "../../types/program";

interface ProgramsFiltersProps {
  filters: ProgramManagementFilters;
  onStatusChange: (status: ProgramStatus | "") => void;
}

export function ProgramsFilters({ filters, onStatusChange }: ProgramsFiltersProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>الحالة</Label>
          <Select
            value={filters.status || "all"}
            onValueChange={(value) => onStatusChange(value === "all" ? "" : (value as ProgramStatus))}
          >
            <SelectTrigger>
              <SelectValue placeholder="كل الحالات" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">كل الحالات</SelectItem>
              <SelectItem value="draft">مسودة</SelectItem>
              <SelectItem value="published">منشور</SelectItem>
              <SelectItem value="archived">مؤرشف</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>حالة الاعتماد</Label>
          <p className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
            غير معتمد (is_approved=0)
          </p>
        </div>
      </div>
    </div>
  );
}
