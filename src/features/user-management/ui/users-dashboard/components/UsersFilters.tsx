import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"
import type { UserStatus, UserType, UsersFilters } from "../../../types/user"

interface UsersFiltersProps {
  filters: UsersFilters
  onSearchChange: (value: string) => void
  onUserTypeChange: (value: UserType | "all") => void
  onStatusChange: (value: UserStatus | "all") => void
}

const userTypeOptions: Array<{ label: string; value: UserType | "all" }> = [
  { label: "All types", value: "all" },
  { label: "Patient", value: "Patient" },
  { label: "Center", value: "Center" },
  { label: "Specialist", value: "Specialist" },
]

const statusOptions: Array<{ label: string; value: UserStatus | "all" }> = [
  { label: "All statuses", value: "all" },
  { label: "Pending", value: "Pending" },
  { label: "Approved", value: "Approved" },
  { label: "Rejected", value: "Rejected" },
  { label: "Active", value: "Active" },
  { label: "Inactive", value: "Inactive" },
]

export function UsersFilters({
  filters,
  onSearchChange,
  onUserTypeChange,
  onStatusChange,
}: UsersFiltersProps) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">Search users</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
            <Input
              value={filters.search}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Search by name, email, or phone"
              className="pl-9"
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">User type</label>
          <Select value={filters.userType} onValueChange={onUserTypeChange}>
            <SelectTrigger>
              <SelectValue placeholder="All types" />
            </SelectTrigger>
            <SelectContent>
              {userTypeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">Status</label>
          <Select value={filters.status} onValueChange={onStatusChange}>
            <SelectTrigger>
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
