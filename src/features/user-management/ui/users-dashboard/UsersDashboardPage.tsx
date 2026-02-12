"use client"

import { Button } from "@/components/ui/button"
import { useUsersDashboard } from "../../hooks/useUsersDashboard"
import { UsersFilters } from "./components/UsersFilters"
import { UsersTable } from "./components/UsersTable"

export function UsersDashboardPage() {
  const {
    users,
    filters,
    updateSearch,
    updateUserType,
    updateStatus,
    clearFilters,
    onViewDetails,
    onApproveUser,
    onDeleteUser,
  } = useUsersDashboard()

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <section className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold text-gray-900">User Management Dashboard</h1>
          <p className="text-sm text-gray-600">
            Review registered users, manage approvals, and keep records updated.
          </p>
        </div>
        <Button variant="outline" onClick={clearFilters}>
          Clear filters
        </Button>
      </section>

      <UsersFilters
        filters={filters}
        onSearchChange={updateSearch}
        onUserTypeChange={updateUserType}
        onStatusChange={updateStatus}
      />

      <UsersTable
        users={users}
        onViewDetails={onViewDetails}
        onApproveUser={onApproveUser}
        onDeleteUser={onDeleteUser}
      />
    </div>
  )
}
