import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { ProgramsFilters } from "../../types/program";

interface ProgramsTableFiltersProps {
  filters: ProgramsFilters;
  onChange: (next: ProgramsFilters) => void;
}

export function ProgramsTableFilters({ filters, onChange }: ProgramsTableFiltersProps) {
  return (
    <div className="grid grid-cols-1 gap-3 rounded-xl border bg-white p-4 md:grid-cols-2 lg:grid-cols-5">
      <div className="relative md:col-span-2">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={filters.search}
          onChange={(event) => onChange({ ...filters, search: event.target.value, page: 1 })}
          placeholder="بحث بعنوان البرنامج أو اسم المنشئ"
          className="w-full pl-10"
          dir="rtl"
        />
      </div>

      <Select
        value={filters.status}
        onValueChange={(value) => onChange({ ...filters, status: value as ProgramsFilters["status"], page: 1 })}
      >
        <SelectTrigger  className="w-full">
          <SelectValue placeholder="الحالة" />
        </SelectTrigger>
        <SelectContent className="text-right" dir="rtl">
          <SelectItem value="all">كل الحالات</SelectItem>
          <SelectItem value="draft">مسودة</SelectItem>
          <SelectItem value="approved">موافق عليه</SelectItem>
          <SelectItem value="rejected">مرفوض</SelectItem>
        </SelectContent>
      </Select>

      {/* <Select
        value={filters.approval}
        onValueChange={(value) => onChange({ ...filters, approval: value as ProgramsFilters["approval"], page: 1 })}
      >
        <SelectTrigger>
          <SelectValue placeholder="حالة الموافقة" />
        </SelectTrigger>
        <SelectContent className="text-right" dir="rtl">
          <SelectItem value="all">الكل</SelectItem>
          <SelectItem value="approved">موافق عليه</SelectItem>
          <SelectItem value="unapproved">غير موافق عليه</SelectItem>
        </SelectContent>
      </Select> */}

      <Select
        value={`${filters.sortBy}:${filters.sortOrder}`}
        onValueChange={(value) => {
          const [sortBy, sortOrder] = value.split(":") as [ProgramsFilters["sortBy"], ProgramsFilters["sortOrder"]];
          onChange({ ...filters, sortBy, sortOrder });
        }}
      >
        <SelectTrigger  className="w-full">
          <SelectValue placeholder="الترتيب" />
        </SelectTrigger>
        <SelectContent className="text-right" dir="rtl">
          <SelectItem value="id:desc">الأحدث (ID)</SelectItem>
          <SelectItem value="id:asc">الأقدم (ID)</SelectItem>
          <SelectItem value="title:asc">العنوان (أ-ي)</SelectItem>
          <SelectItem value="price:desc">السعر (الأعلى)</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
