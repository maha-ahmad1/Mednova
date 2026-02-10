export type UserType = "Patient" | "Center" | "Specialist"

export type UserStatus =
  | "Pending"
  | "Approved"
  | "Rejected"
  | "Active"
  | "Inactive"

export interface DashboardUser {
  id: string
  fullName: string
  email: string
  phone: string
  userType: UserType
  status: UserStatus
}

export interface UsersFilters {
  search: string
  userType: UserType | "all"
  status: UserStatus | "all"
}
