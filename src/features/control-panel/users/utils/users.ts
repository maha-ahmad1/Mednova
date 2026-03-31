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

const accountTypeMap: Record<UsersApiAccountType, UserType> = {
  patient: "Patient",
  therapist: "Specialist",
  rehabilitation_center: "Center",
};

export const mapAccountTypeToUserType = (accountType: UsersApiAccountType): UserType => {
  return accountTypeMap[accountType];
};

const approvalStatusMap: Record<UsersApiApprovalStatus, UserStatus> = {
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected",
};

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
  isSubscribed: Boolean(user.is_subscribed),
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

export const filterUsersByDate = (
  users: AdminUser[],
  filters: UsersFilters,
): AdminUser[] => {
  return users.filter((user) => {
    const subscriptionMatches =
      filters.subscription === "all" ||
      (filters.subscription === "subscribed" ? user.isSubscribed : !user.isSubscribed);

    if (!subscriptionMatches) {
      return false;
    }

    const createdAt = new Date(user.createdAt).getTime();

    if (Number.isNaN(createdAt)) {
      return !filters.dateFrom && !filters.dateTo;
    }

    const fromDate = filters.dateFrom
      ? new Date(`${filters.dateFrom}T00:00:00`).getTime()
      : undefined;
    const toDate = filters.dateTo
      ? new Date(`${filters.dateTo}T23:59:59`).getTime()
      : undefined;

    const matchesFrom = fromDate === undefined || createdAt >= fromDate;
    const matchesTo = toDate === undefined || createdAt <= toDate;

    return matchesFrom && matchesTo;
  });
};
