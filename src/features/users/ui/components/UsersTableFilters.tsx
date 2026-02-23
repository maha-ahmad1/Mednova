import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { UserStatus, UserType, UserVerificationFilter, UsersFilters } from "../../types/user";

interface UsersTableFiltersProps {
  filters: UsersFilters;
  onChange: (nextFilters: UsersFilters) => void;
}

const userTypeOptions: Array<{ label: string; value: "all" | UserType }> = [
  { label: "جميع الأنواع", value: "all" },
  { label: "مريض", value: "Patient" },
  { label: "مختص", value: "Specialist" },
  { label: "مركز", value: "Center" },
];

const statusOptions: Array<{ label: string; value: "all" | UserStatus }> = [
  { label: "جميع الحالات", value: "all" },
  { label: "معلق", value: "Pending" },
  { label: "موافق", value: "Approved" },
  { label: "مرفوض", value: "Rejected" },
  // { label: "معلق مؤقت", value: "Suspended" },
];

const verificationOptions: Array<{ label: string; value: UserVerificationFilter }> = [
  { label: "حالة التوثيق", value: "all" },
  { label: "موثق", value: "verified" },
  { label: "غير موثق", value: "unverified" },
];


export function UsersTableFilters({ filters, onChange }: UsersTableFiltersProps) {
  return (
    <div className="grid gap-3 rounded-xl border bg-white p-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-5">
      {/* حقل البحث - يأخذ العرض الكامل على الموبايل، وعمودين على الشاشات المتوسطة، وعمودين على الكبيرة */}
      <div className="relative md:col-span-1 lg:col-span-2">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={filters.search}
          onChange={(event) => onChange({ ...filters, search: event.target.value })}
          placeholder="بحث بالاسم أو البريد الإلكتروني"
          className="pl-10 w-full"
          dir="rtl"
        />
      </div>

      {/* فلتر نوع المستخدم - عرض كامل على الموبايل */}
      <Select
        value={filters.type}
        onValueChange={(value) => onChange({ ...filters, type: value as UsersFilters["type"] })}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="نوع المستخدم" />
        </SelectTrigger>
        <SelectContent className="text-right" dir="rtl">
          {userTypeOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* فلتر الحالة - عرض كامل على الموبايل */}
      <Select
        value={filters.status}
        onValueChange={(value) => onChange({ ...filters, status: value as UsersFilters["status"] })}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="الحالة" />
        </SelectTrigger>
        <SelectContent className="text-right" dir="rtl">
          {statusOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.verification}
        onValueChange={(value) =>
          onChange({ ...filters, verification: value as UserVerificationFilter })
        }
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="حالة التوثيق" />
        </SelectTrigger>
        <SelectContent className="text-right" dir="rtl">
          {verificationOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* الفلاتر الإضافية - يمكن إضافتها عند الحاجة */}
      {/* <div className="grid grid-cols-2 gap-2 md:col-span-2 lg:col-span-1">
        <Input
          type="date"
          value={filters.dateFrom}
          onChange={(event) => onChange({ ...filters, dateFrom: event.target.value })}
          aria-label="من تاريخ"
          className="w-full"
          dir="rtl"
        />
        <Input
          type="date"
          value={filters.dateTo}
          onChange={(event) => onChange({ ...filters, dateTo: event.target.value })}
          aria-label="إلى تاريخ"
          className="w-full"
          dir="rtl"
        />
      </div> */}
    </div>
  );
}