import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { UsersFilters, UserStatus, UserType } from "../../types/user";

interface UsersTableFiltersProps {
  filters: UsersFilters;
  onChange: (nextFilters: UsersFilters) => void;
}

const userTypeOptions: Array<{ label: string; value: "all" | UserType }> = [
  { label: "All Types", value: "all" },
  { label: "Patient", value: "Patient" },
  { label: "Specialist", value: "Specialist" },
  { label: "Center", value: "Center" },
];

const statusOptions: Array<{ label: string; value: "all" | UserStatus }> = [
  { label: "All Statuses", value: "all" },
  { label: "Pending", value: "Pending" },
  { label: "Approved", value: "Approved" },
  { label: "Rejected", value: "Rejected" },
  { label: "Suspended", value: "Suspended" },
];

export function UsersTableFilters({ filters, onChange }: UsersTableFiltersProps) {
  return (
    <div className="grid gap-3 rounded-xl border bg-white p-4 md:grid-cols-2 lg:grid-cols-5">
      <div className="relative lg:col-span-2">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={filters.search}
          onChange={(event) => onChange({ ...filters, search: event.target.value })}
          placeholder="Search by name or email"
          className="pl-10"
        />
      </div>

      <Select
        value={filters.type}
        onValueChange={(value) => onChange({ ...filters, type: value as UsersFilters["type"] })}
      >
        <SelectTrigger>
          <SelectValue placeholder="Filter by user type" />
        </SelectTrigger>
        <SelectContent>
          {userTypeOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.status}
        onValueChange={(value) => onChange({ ...filters, status: value as UsersFilters["status"] })}
      >
        <SelectTrigger>
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          {statusOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="grid grid-cols-2 gap-2">
        <Input
          type="date"
          value={filters.dateFrom}
          onChange={(event) => onChange({ ...filters, dateFrom: event.target.value })}
          aria-label="Date from"
          className="p-3"
        />
        <Input
          type="date"
          value={filters.dateTo}
          onChange={(event) => onChange({ ...filters, dateTo: event.target.value })}
          aria-label="Date to"
          className="p-3"
        />
      </div>
    </div>
  );
}
