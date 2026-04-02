export type UserType = "Patient" | "Specialist" | "Center";

export type UserStatus = "Pending" | "Approved" | "Rejected";

export type UserVerificationFilter = "all" | "verified" | "unverified";
export type UserSubscriptionFilter = "all" | "subscribed" | "unsubscribed";

export interface AdminUser {
  id: string;
  fullName: string;
  email: string;
  type: UserType;
  status: UserStatus;
  isEmailVerified: boolean;
  isBlocked: boolean;
  isSubscribed: boolean;
  createdAt: string;
}

export interface UsersFilters {
  search: string;
  type: "all" | UserType;
  status: "all" | UserStatus;
  verification: UserVerificationFilter;
  subscription: UserSubscriptionFilter;
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
  account_status?: "active" | "inactive" | string;
  is_subscribed?: boolean;
  created_at?: string;
}

export type SubscriptionApiAccountType = UsersApiAccountType;

export interface SubscribingUser {
  id: string;
  fullName: string;
  email: string;
  accountType: UserType;
  packageName: string;
  packageType: string;
  startsAt: string;
  endsAt: string;
}

export interface SubscribingApiUser {
  id: number;
  subscriber?: {
    full_name: string;
    email: string;
    type_account: SubscriptionApiAccountType;
  };
  package?: {
    name: string;
    type: string;
  };
  full_name?: string;
  email?: string;
  type_account?: SubscriptionApiAccountType;
  package_name?: string;
  package_type?: string;
  starts_at: string;
  ends_at: string;
}

export interface UsersApiResponse {
  success: boolean;
  message: string;
  data: UsersApiUser[];
  pagination?: PaginationMeta;
  status: string;
}

export interface PaginationMeta {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
  from: number | null;
  to: number | null;
  has_more_pages: boolean;
}

export interface UserLocationDetails {
  id: number;
  latitude: string | null;
  longitude: string | null;
  formatted_address: string | null;
  country: string | null;
  region: string | null;
  city: string | null;
  district: string | null;
  postal_code: string | null;
  location_type: string | null;
}

export interface UserCenterDetails {
  id: number;
  name_center: string | null;
  year_establishment: number | null;
  license_number: string | null;
  license_authority: string | null;
  license_file: string | null;
  bio: string | null;
  has_commercial_registration: number;
  commercial_registration_number: string | null;
  commercial_registration_file: string | null;
  commercial_registration_authority: string | null;
  video_consultation_price: string | null;
  chat_consultation_price: string | null;
  currency: string | null;
}

export interface UserSchedule {
  id: number;
  day_of_week: string[];
  start_time_morning: string | null;
  end_time_morning: string | null;
  is_have_evening_time: boolean;
  start_time_evening: string | null;
  end_time_evening: string | null;
  type_time: "offline" | "online";
}

export interface AdminUserDetails {
  id: number;
  image: string | null;
  full_name: string;
  email: string;
  phone: string | null;
  type_account: UsersApiAccountType;
  birth_date: string | null;
  gender: string | null;
  patient_details: unknown;
  location_details: UserLocationDetails | null;
  therapist_details: unknown;
  center_details: UserCenterDetails | null;
  medicalSpecialties: unknown[];
  schedules: UserSchedule[];
  average_rating: number | null;
  total_reviews: number | null;
  is_completed: boolean;
  approval_status: UsersApiApprovalStatus;
  timezone: string | null;
  email_verified_at: string | null;
  phone_verified_at: string | null;
}
