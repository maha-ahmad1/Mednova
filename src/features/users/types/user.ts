export type UserType = "Patient" | "Specialist" | "Center";

export type UserStatus = "Pending" | "Approved" | "Rejected";

export type UserVerificationFilter = "all" | "verified" | "unverified";

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
  verification: UserVerificationFilter;
  dateFrom: string;
  dateTo: string;
}

export type UsersApiAccountType = "patient" | "therapist" | "rehabilitation_center";

export type UsersApiApprovalStatus = "pending" | "approved" | "rejected";

export interface UsersApiUser {
  id: number;
  full_name: string;
  email: string;
  type_account: UsersApiAccountType;
  approval_status: UsersApiApprovalStatus;
  email_verified_at: string | null;
  created_at?: string;
}

export interface UsersApiResponse {
  success: boolean;
  message: string;
  data: UsersApiUser[];
  status: string;
}
