import { format } from "date-fns";
import type {
  AdminUser,
  SubscribingApiUser,
  SubscribingUser,
  UserStatus,
  UserType,
  UsersApiApprovalStatus,
  UsersApiAccountType,
  UsersApiUser,
  UsersFilters,
} from "../types/user";


import { getTranslations } from "next-intl/server";

// Helper to get translated user type
export async function getUserTypeLabel(type: UsersApiAccountType, locale: string) {
  const t = await getTranslations({ locale, namespace: "users" });
  switch (type) {
    case "patient": return t("type.patient", { default: "Patient" });
    case "therapist": return t("type.therapist", { default: "Specialist" });
    case "rehabilitation_center": return t("type.center", { default: "Center" });
    default: return type;
  }
}

// Helper to get translated user status
export async function getUserStatusLabel(status: UsersApiApprovalStatus, locale: string) {
  const t = await getTranslations({ locale, namespace: "users" });
  switch (status) {
    case "pending": return t("status.pending", { default: "Pending" });
    case "approved": return t("status.approved", { default: "Approved" });
    case "rejected": return t("status.rejected", { default: "Rejected" });
    default: return status;
  }
}

const typeToApiMap: Record<Exclude<UsersFilters["type"], "all">, UsersApiAccountType> = {
  Patient: "patient",
  Specialist: "therapist",
  Center: "rehabilitation_center",
};

const statusToApiMap: Record<Exclude<UsersFilters["status"], "all">, UsersApiApprovalStatus> = {
  Pending: "pending",
  Approved: "approved",
  Rejected: "rejected",
};

export const mapApiUserToAdminUser = (user: UsersApiUser): AdminUser => ({
  id: String(user.id),
  fullName: user.full_name,
  email: user.email,
  type: mapAccountTypeToUserType(user.type_account),
  status: approvalStatusMap[user.approval_status],
  isEmailVerified: Boolean(user.email_verified_at),
  isBlocked: false,
  isSubscribed: user.account_status === "active",
  createdAt: user.created_at ?? "",
});

export const mapApiSubscribingUser = (user: SubscribingApiUser): SubscribingUser => ({
  id: String(user.id),
  fullName: user.subscriber?.full_name ?? user.full_name ?? "-",
  email: user.subscriber?.email ?? user.email ?? "-",
  accountType: mapAccountTypeToUserType(
    user.subscriber?.type_account ?? user.type_account ?? "patient",
  ),
  packageName: user.package?.name ?? user.package_name ?? "-",
  packageType: user.package?.type ?? user.package_type ?? "-",
  startsAt: user.starts_at,
  endsAt: user.ends_at,
});

export const buildUsersQueryParams = (
  filters: UsersFilters,
  pagination?: { page?: number; per_page?: number },
) => {
  return {
    ...(filters.search.trim() ? { search: filters.search.trim() } : {}),
    ...(filters.type !== "all" ? { type_account: typeToApiMap[filters.type] } : {}),
    ...(filters.status !== "all" ? { approval_status: statusToApiMap[filters.status] } : {}),
    ...(filters.verification === "verified"
      ? { verified: 1 }
      : filters.verification === "unverified"
        ? { verified: 0 }
        : {}),
    ...(filters.subscription === "subscribed"
      ? { account_status: "active" }
      : filters.subscription === "unsubscribed"
        ? { account_status: "inactive" }
        : {}),
    ...(pagination?.page ? { page: pagination.page } : {}),
    ...(pagination?.per_page ? { per_page: pagination.per_page } : {}),
  };
};

export const formatJoinDate = (value: string): string => {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return format(date, "MMM dd, yyyy");
};
