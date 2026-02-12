export type UserType = "Patient" | "Specialist" | "Center";

export type UserStatus =
  | "Pending"
  | "Approved"
  | "Rejected"
  | "Suspended";

export interface AdminUser {
  id: string;
  fullName: string;
  email: string;
  type: UserType;
  status: UserStatus;
  isEmailVerified: boolean;
  isBlocked: boolean;
  createdAt: string;
}

export interface UsersFilters {
  search: string;
  type: "all" | UserType;
  status: "all" | UserStatus;
  dateFrom: string;
  dateTo: string;
}
