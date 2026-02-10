"use client"

import { useEffect, useMemo, useState } from "react"
import { toast } from "sonner"
import { getDashboardUsers } from "../services/users.service"
import type { DashboardUser, UserStatus, UserType, UsersFilters } from "../types/user"

const defaultFilters: UsersFilters = {
  search: "",
  userType: "all",
  status: "all",
}

export function useUsersDashboard() {
  const [users, setUsers] = useState<DashboardUser[]>([])
  const [filters, setFilters] = useState<UsersFilters>(defaultFilters)

  useEffect(() => {
    getDashboardUsers().then(setUsers)
  }, [])

  const filteredUsers = useMemo(() => {
    const normalizedSearch = filters.search.trim().toLowerCase()

    return users.filter((user) => {
      const matchesType = filters.userType === "all" || user.userType === filters.userType
      const matchesStatus = filters.status === "all" || user.status === filters.status

      const matchesSearch =
        normalizedSearch.length === 0 ||
        user.fullName.toLowerCase().includes(normalizedSearch) ||
        user.email.toLowerCase().includes(normalizedSearch) ||
        user.phone.toLowerCase().includes(normalizedSearch)

      return matchesType && matchesStatus && matchesSearch
    })
  }, [users, filters])

  const updateSearch = (search: string) => {
    setFilters((prev) => ({ ...prev, search }))
  }

  const updateUserType = (userType: UserType | "all") => {
    setFilters((prev) => ({ ...prev, userType }))
  }

  const updateStatus = (status: UserStatus | "all") => {
    setFilters((prev) => ({ ...prev, status }))
  }

  const clearFilters = () => {
    setFilters(defaultFilters)
  }

  const onViewDetails = (user: DashboardUser) => {
    toast.info(`View details clicked for ${user.fullName}`)
  }

  const onApproveUser = (userId: string) => {
    setUsers((prev) =>
      prev.map((user) => (user.id === userId ? { ...user, status: "Approved" } : user)),
    )
    toast.success("User approved successfully")
  }

  const onDeleteUser = (userId: string) => {
    const selectedUser = users.find((user) => user.id === userId)

    if (!selectedUser) {
      return
    }

    const isConfirmed = window.confirm(
      `Are you sure you want to delete ${selectedUser.fullName}? This action cannot be undone.`,
    )

    if (!isConfirmed) {
      return
    }

    setUsers((prev) => prev.filter((user) => user.id !== userId))
    toast.success("User deleted successfully")
  }

  return {
    users: filteredUsers,
    filters,
    updateSearch,
    updateUserType,
    updateStatus,
    clearFilters,
    onViewDetails,
    onApproveUser,
    onDeleteUser,
  }
}
