import { format } from "date-fns";
import type { AdminUser, UsersFilters } from "../types/user";

export const formatJoinDate = (value: string): string => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return format(date, "MMM dd, yyyy");
};

export const filterUsers = (
  users: AdminUser[],
  filters: UsersFilters,
): AdminUser[] => {
  return users.filter((user) => {
    const normalizedSearch = filters.search.trim().toLowerCase();
    const matchesSearch =
      normalizedSearch.length === 0 ||
      user.fullName.toLowerCase().includes(normalizedSearch) ||
      user.email.toLowerCase().includes(normalizedSearch);

    const matchesType = filters.type === "all" || user.type === filters.type;
    const matchesStatus =
      filters.status === "all" || user.status === filters.status;

    const createdAt = new Date(user.createdAt).getTime();
    const fromDate = filters.dateFrom
      ? new Date(`${filters.dateFrom}T00:00:00`).getTime()
      : undefined;
    const toDate = filters.dateTo
      ? new Date(`${filters.dateTo}T23:59:59`).getTime()
      : undefined;

    const matchesFrom = fromDate === undefined || createdAt >= fromDate;
    const matchesTo = toDate === undefined || createdAt <= toDate;

    return (
      matchesSearch &&
      matchesType &&
      matchesStatus &&
      matchesFrom &&
      matchesTo
    );
  });
};
