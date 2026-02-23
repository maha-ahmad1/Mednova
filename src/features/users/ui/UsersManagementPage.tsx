"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useAdminUsers } from "../hooks/useAdminUsers";
import type { AdminUser, UserStatus, UsersFilters } from "../types/user";
import { filterUsersByDate, formatJoinDate } from "../utils/users";
import { ConfirmationModal } from "./components/ConfirmationModal";
import { EmailVerificationIndicator } from "./components/EmailVerificationIndicator";
import { StatusDropdown } from "./components/StatusDropdown";
import { UserActionsDropdown } from "./components/UserActionsDropdown";
import { UserTypeBadge } from "./components/UserTypeBadge";
import { UsersTableFilters } from "./components/UsersTableFilters";

type PendingAction =
  | { kind: "status"; userId: string; nextStatus: UserStatus }
  | { kind: "toggle-block"; userId: string }
  | { kind: "delete"; userId: string }
  | { kind: "bulk-approve"; userIds: string[] }
  | null;

const statusLabels: Record<UserStatus, string> = {
  Pending: "قيد الانتظار",
  Approved: "موافق عليه",
  Rejected: "مرفوض",
};

const initialFilters: UsersFilters = {
  search: "",
  type: "all",
  status: "all",
  verification: "all",
  dateFrom: "",
  dateTo: "",
};

export function UsersManagementPage() {
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [filters, setFilters] = useState<UsersFilters>(initialFilters);
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);

  const { users: fetchedUsers, isLoading, isError } = useAdminUsers(filters);
  const [overrides, setOverrides] = useState<Record<string, Partial<AdminUser>>>({});
  const [deletedUserIds, setDeletedUserIds] = useState<string[]>([]);

  const users = useMemo(
    () =>
      fetchedUsers
        .filter((user) => !deletedUserIds.includes(user.id))
        .map((user) => ({
          ...user,
          ...(overrides[user.id] ?? {}),
        })),
    [deletedUserIds, fetchedUsers, overrides],
  );

  const filteredUsers = useMemo(() => filterUsersByDate(users, filters), [users, filters]);

  const allVisibleSelected =
    filteredUsers.length > 0 && filteredUsers.every((user) => selectedRows.includes(user.id));

  const openConfirmation = (action: PendingAction) => {
    setPendingAction(action);
  };

  const handleSelectAll = (checked: boolean | "indeterminate") => {
    if (!checked) {
      setSelectedRows((prev) => prev.filter((id) => !filteredUsers.some((user) => user.id === id)));
      return;
    }

    setSelectedRows((prev) => {
      const next = new Set(prev);
      filteredUsers.forEach((user) => next.add(user.id));
      return Array.from(next);
    });
  };

  const handleSelectRow = (userId: string, checked: boolean | "indeterminate") => {
    setSelectedRows((prev) => {
      if (!checked) {
        return prev.filter((id) => id !== userId);
      }

      return Array.from(new Set([...prev, userId]));
    });
  };

  const confirmAction = () => {
    if (!pendingAction) return;

    if (pendingAction.kind === "status") {
      setOverrides((prev) => ({
        ...prev,
        [pendingAction.userId]: {
          ...prev[pendingAction.userId],
          status: pendingAction.nextStatus,
        },
      }));
    }

    if (pendingAction.kind === "toggle-block") {
      const target = users.find((user) => user.id === pendingAction.userId);
      setOverrides((prev) => ({
        ...prev,
        [pendingAction.userId]: {
          ...prev[pendingAction.userId],
          isBlocked: !(target?.isBlocked ?? false),
        },
      }));
    }

    if (pendingAction.kind === "delete") {
      setDeletedUserIds((prev) => Array.from(new Set([...prev, pendingAction.userId])));
      setSelectedRows((prev) => prev.filter((id) => id !== pendingAction.userId));
    }

    if (pendingAction.kind === "bulk-approve") {
      setOverrides((prev) => {
        const next = { ...prev };
        pendingAction.userIds.forEach((userId) => {
          next[userId] = {
            ...next[userId],
            status: "Approved",
          };
        });
        return next;
      });
      setSelectedRows([]);
    }

    setPendingAction(null);
  };

  const visibleUsers = filteredUsers;

  const getConfirmationCopy = () => {
    if (!pendingAction) {
      return {
        title: "",
        description: "",
        confirmLabel: "تأكيد",
      };
    }

    if (pendingAction.kind === "status") {
      return {
        title: "تغيير حالة المستخدم",
        description: `هل أنت متأكد أنك تريد تغيير حالة هذا المستخدم إلى ${statusLabels[pendingAction.nextStatus]}؟`,
        confirmLabel: "تحديث الحالة",
      };
    }

    if (pendingAction.kind === "toggle-block") {
      const user = users.find((item) => item.id === pendingAction.userId);
      const isCurrentlyBlocked = user?.isBlocked;

      return {
        title: isCurrentlyBlocked ? "إلغاء حظر المستخدم" : "حظر المستخدم",
        description: isCurrentlyBlocked
          ? "سيتمكن هذا المستخدم من الوصول إلى المنصة مرة أخرى."
          : "سيتم حظر هذا المستخدم من الوصول إلى المنصة.",
        confirmLabel: isCurrentlyBlocked ? "إلغاء الحظر" : "حظر",
      };
    }

    if (pendingAction.kind === "delete") {
      return {
        title: "حذف المستخدم",
        description: "لا يمكن التراجع عن هذا الإجراء. هل أنت متأكد أنك تريد حذف هذا المستخدم؟",
        confirmLabel: "حذف",
      };
    }

    return {
      title: "الموافقة على المستخدمين المحددين",
      description: `هل تريد الموافقة على ${pendingAction.userIds.length} مستخدم/مستخدمين محددين؟`,
      confirmLabel: "الموافقة",
    };
  };

  const confirmationCopy = getConfirmationCopy();

  return (
    <div className="mx-auto w-full max-w-7xl space-y-5 p-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold text-foreground">إدارة المستخدمين</h1>
        <p className="text-sm text-muted-foreground">إدارة حسابات المستخدمين، حالاتهم، وإجراءات الإشراف.</p>
      </div>

      <UsersTableFilters filters={filters} onChange={setFilters} />

      {selectedRows.length > 0 && (
        <div className="flex items-center justify-between rounded-lg border bg-white p-3">
          <p className="text-sm text-muted-foreground">{selectedRows.length} selected</p>
          <Button onClick={() => openConfirmation({ kind: "bulk-approve", userIds: selectedRows })}>
            Approve Selected
          </Button>
        </div>
      )}

      <div className="overflow-x-auto rounded-xl border bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted/40 text-muted-foreground">
            <tr>
              <th className="w-12 px-4 py-3">
                <Checkbox
                  checked={allVisibleSelected}
                  onCheckedChange={handleSelectAll}
                  aria-label="Select all users"
                />
              </th>
              <th className="px-4 py-3 font-medium text-right">الاسم</th>
              <th className="px- py-3 font-medium ">نوع المستخدم</th>
              <th className="px-6 py-3 font-medium ">الحالة</th>
              <th className="px-4 py-3 font-medium">توثيق البريد</th>
              <th className="px-4 py-3 font-medium">تاريخ الانضمام</th>
              <th className="px-4 py-3 font-medium">الإجراءات</th>
            </tr>
          </thead>

          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-muted-foreground">
                  جاري تحميل المستخدمين...
                </td>
              </tr>
            )}

            {!isLoading && isError && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-destructive">
                  تعذر تحميل بيانات المستخدمين. حاول مرة أخرى.
                </td>
              </tr>
            )}

            {!isLoading && !isError && visibleUsers.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-muted-foreground">
                  No users found.
                </td>
              </tr>
            )}

            {!isLoading &&
              !isError &&
              visibleUsers.map((user) => (
                <tr key={user.id} className="border-t align-middle">
                  <td className="px-4 py-3">
                    <Checkbox
                      checked={selectedRows.includes(user.id)}
                      onCheckedChange={(checked) => handleSelectRow(user.id, checked)}
                      aria-label={`Select ${user.fullName}`}
                    />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="font-medium text-foreground">{user.fullName}</div>
                    <div className="text-xs text-muted-foreground">{user.email}</div>
                  </td>
                  <td className="px-4 py-3">
                    <UserTypeBadge type={user.type} />
                  </td>
                  <td className="px-4 py-3">
                    <StatusDropdown
                      status={user.status}
                      onSelectStatus={(nextStatus) =>
                        openConfirmation({
                          kind: "status",
                          userId: user.id,
                          nextStatus,
                        })
                      }
                    />
                  </td>
                  <td className="px-4 py-3">
                    <EmailVerificationIndicator isVerified={user.isEmailVerified} />
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{formatJoinDate(user.createdAt)}</td>
                  <td className="px-4 py-3">
                    <UserActionsDropdown
                      isBlocked={user.isBlocked}
                      onViewDetails={() => console.info(`View details for ${user.fullName}`)}
                      onToggleBlock={() => openConfirmation({ kind: "toggle-block", userId: user.id })}
                      onDelete={() => openConfirmation({ kind: "delete", userId: user.id })}
                    />
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <ConfirmationModal
        open={Boolean(pendingAction)}
        title={confirmationCopy.title}
        description={confirmationCopy.description}
        confirmLabel={confirmationCopy.confirmLabel}
        onOpenChange={(open) => {
          if (!open) {
            setPendingAction(null);
          }
        }}
        onConfirm={confirmAction}
      />
    </div>
  );
}
