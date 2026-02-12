"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { mockUsers } from "../data/mock-users";
import type { AdminUser, UserStatus, UsersFilters } from "../types/user";
import { filterUsers, formatJoinDate } from "../utils/users";
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

const initialFilters: UsersFilters = {
  search: "",
  type: "all",
  status: "all",
  dateFrom: "",
  dateTo: "",
};

export function UsersManagementPage() {
  const [users, setUsers] = useState<AdminUser[]>(mockUsers);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [filters, setFilters] = useState<UsersFilters>(initialFilters);
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);

  const filteredUsers = useMemo(() => filterUsers(users, filters), [users, filters]);

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
      setUsers((prev) =>
        prev.map((user) =>
          user.id === pendingAction.userId
            ? { ...user, status: pendingAction.nextStatus }
            : user,
        ),
      );
    }

    if (pendingAction.kind === "toggle-block") {
      setUsers((prev) =>
        prev.map((user) =>
          user.id === pendingAction.userId
            ? { ...user, isBlocked: !user.isBlocked }
            : user,
        ),
      );
    }

    if (pendingAction.kind === "delete") {
      setUsers((prev) => prev.filter((user) => user.id !== pendingAction.userId));
      setSelectedRows((prev) => prev.filter((id) => id !== pendingAction.userId));
    }

    if (pendingAction.kind === "bulk-approve") {
      const idSet = new Set(pendingAction.userIds);
      setUsers((prev) =>
        prev.map((user) =>
          idSet.has(user.id)
            ? { ...user, status: "Approved" }
            : user,
        ),
      );
      setSelectedRows([]);
    }

    setPendingAction(null);
  };

  const getConfirmationCopy = () => {
    if (!pendingAction) {
      return {
        title: "",
        description: "",
        confirmLabel: "Confirm",
      };
    }

    if (pendingAction.kind === "status") {
      return {
        title: "Change user status",
        description: `Are you sure you want to change this user status to ${pendingAction.nextStatus}?`,
        confirmLabel: "Update status",
      };
    }

    if (pendingAction.kind === "toggle-block") {
      const user = users.find((item) => item.id === pendingAction.userId);
      const isCurrentlyBlocked = user?.isBlocked;

      return {
        title: isCurrentlyBlocked ? "Unblock user" : "Block user",
        description: isCurrentlyBlocked
          ? "This user will regain access to the platform."
          : "This user will be blocked from accessing the platform.",
        confirmLabel: isCurrentlyBlocked ? "Unblock" : "Block",
      };
    }

    if (pendingAction.kind === "delete") {
      return {
        title: "Delete user",
        description: "This action cannot be undone. Are you sure you want to delete this user?",
        confirmLabel: "Delete",
      };
    }

    return {
      title: "Approve selected users",
      description: `Approve ${pendingAction.userIds.length} selected users?`,
      confirmLabel: "Approve selected",
    };
  };

  const confirmationCopy = getConfirmationCopy();

  return (
    <div className="mx-auto w-full max-w-7xl space-y-5 p-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold text-foreground">Users Management</h1>
        <p className="text-sm text-muted-foreground">Manage user accounts, statuses, and moderation actions.</p>
      </div>

      <UsersTableFilters filters={filters} onChange={setFilters} />

      {selectedRows.length > 0 && (
        <div className="flex items-center justify-between rounded-lg border bg-white p-3">
          <p className="text-sm text-muted-foreground">{selectedRows.length} selected</p>
          <Button
            onClick={() => openConfirmation({ kind: "bulk-approve", userIds: selectedRows })}
          >
            Approve Selected
          </Button>
        </div>
      )}

      <div className="overflow-hidden rounded-xl border bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-muted/40 text-muted-foreground">
            <tr>
              <th className="w-12 px-4 py-3">
                <Checkbox
                  checked={allVisibleSelected}
                  onCheckedChange={handleSelectAll}
                  aria-label="Select all users"
                />
              </th>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">User Type</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Email Verification</th>
              <th className="px-4 py-3 font-medium">Join Date</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-muted-foreground">
                  No users found.
                </td>
              </tr>
            )}

            {filteredUsers.map((user) => (
              <tr key={user.id} className="border-t align-middle">
                <td className="px-4 py-3">
                  <Checkbox
                    checked={selectedRows.includes(user.id)}
                    onCheckedChange={(checked) => handleSelectRow(user.id, checked)}
                    aria-label={`Select ${user.fullName}`}
                  />
                </td>
                <td className="px-4 py-3">
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
                <td className="px-4 py-3 text-muted-foreground">
                  {formatJoinDate(user.createdAt)}
                </td>
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
