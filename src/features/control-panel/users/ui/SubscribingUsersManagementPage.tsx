"use client";

import { useMemo, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PaginationControls } from "@/shared/ui/components/PaginationControls";
import { ConfirmationModal } from "./components/ConfirmationModal";
import { useSubscribingUsers } from "../hooks/useSubscribingUsers";
import { useDeactivateSubscription } from "../hooks/useDeactivateSubscription";
import { formatJoinDate } from "../utils/users";
import { UserTypeBadge } from "./components/UserTypeBadge";
import { UserActionsDropdown } from "./components/UserActionsDropdown";
import { UsersSearchInput } from "./components/UsersSearchInput";

type PendingAction = { kind: "deactivate-subscription"; id: string; fullName: string } | null;

const SKELETON_ROWS_COUNT = 10;
const SUBSCRIBERS_PER_PAGE = 10;

type AccountTypeFilter = "all" | "Specialist" | "Center";

interface SubscribersFilters {
  search: string;
  accountType: AccountTypeFilter;
}

const initialFilters: SubscribersFilters = {
  search: "",
  accountType: "all",
};

const getConfirmationCopy = (pendingAction: PendingAction) => {
  if (!pendingAction) {
    return {
      title: "",
      description: "",
      confirmLabel: "تأكيد",
    };
  }

  return {
    title: "تعطيل الاشتراك",
    description: `هل أنت متأكد أنك تريد تعطيل اشتراك ${pendingAction.fullName}؟`,
    confirmLabel: "تعطيل",
  };
};

export function SubscribingUsersManagementPage() {
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<SubscribersFilters>(initialFilters);
  const { users, isLoading, isFetching, isError, pagination } = useSubscribingUsers(currentPage, SUBSCRIBERS_PER_PAGE, {
    search: filters.search,
    type: filters.accountType,
  });
  const { mutateAsync: deactivateSubscription, isPending: isDeactivatingSubscription } =
    useDeactivateSubscription();

  const confirmationCopy = useMemo(() => getConfirmationCopy(pendingAction), [pendingAction]);

  const displayedUsers = useMemo(() => users, [users]);

  const onConfirmAction = async () => {
    if (!pendingAction) {
      return;
    }

    await deactivateSubscription(pendingAction.id);
    setPendingAction(null);
  };

  return (
    <div className="mx-auto w-full max-w-7xl space-y-5 p-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold text-foreground">المستخدمون المشتركون</h1>
        <p className="text-sm text-muted-foreground">إدارة الاشتراكات الفعالة وتعطيلها عند الحاجة.</p>
      </div>

      <div className="grid grid-cols-1 gap-3 rounded-xl border bg-white p-4 md:grid-cols-2 lg:grid-cols-5">
        <UsersSearchInput
          value={filters.search}
          onChange={(value) => {
            setFilters((prev) => ({ ...prev, search: value }));
            setCurrentPage(1);
          }}
        />

        <Select
          value={filters.accountType}
          onValueChange={(value) => {
            setFilters((prev) => ({ ...prev, accountType: value as AccountTypeFilter }));
            setCurrentPage(1);
          }}
        >
          <SelectTrigger className="w-full"><SelectValue placeholder="نوع الحساب" /></SelectTrigger>
          <SelectContent className="text-right" dir="rtl">
            <SelectItem value="all">كل الأنواع</SelectItem>
            <SelectItem value="Specialist">مختص</SelectItem>
            <SelectItem value="Center">مركز</SelectItem>
          </SelectContent>
        </Select>

      </div>

      <div className="overflow-x-auto rounded-xl border bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted/40 text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium text-right">الاسم</th>
              <th className="px-4 py-3 font-medium">نوع الحساب</th>
              <th className="px-4 py-3 font-medium">الباقة</th>
              <th className="px-4 py-3 font-medium">نوع الباقة</th>
              <th className="px-4 py-3 font-medium">تاريخ البداية</th>
              <th className="px-4 py-3 font-medium">تاريخ الانتهاء</th>
              <th className="px-4 py-3 font-medium">الإجراءات</th>
            </tr>
          </thead>

          <tbody>
            {(isLoading || isFetching) &&
              Array.from({ length: SKELETON_ROWS_COUNT }).map((_, index) => (
                <tr key={`subscribing-users-skeleton-${index}`} className="border-t align-middle">
                  <td className="px-4 py-3 text-right">
                    <Skeleton className="h-4 w-40" />
                  </td>
                  <td className="px-4 py-3">
                    <Skeleton className="h-6 w-24" />
                  </td>
                  <td className="px-4 py-3">
                    <Skeleton className="h-4 w-36" />
                  </td>
                  <td className="px-4 py-3">
                    <Skeleton className="h-4 w-28" />
                  </td>
                  <td className="px-4 py-3">
                    <Skeleton className="h-4 w-28" />
                  </td>
                  <td className="px-4 py-3">
                    <Skeleton className="h-4 w-28" />
                  </td>
                  <td className="px-4 py-3">
                    <Skeleton className="h-8 w-10" />
                  </td>
                </tr>
              ))}

            {!isLoading && !isFetching && isError && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-destructive">
                  تعذر تحميل بيانات الاشتراكات. حاول مرة أخرى.
                </td>
              </tr>
            )}

            {!isLoading && !isFetching && !isError && displayedUsers.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-muted-foreground">
                  لا يوجد مستخدمون مشتركون حالياً.
                </td>
              </tr>
            )}

            {!isLoading &&
              !isFetching &&
              !isError &&
              displayedUsers.map((user) => (
                <tr key={user.id} className="border-t align-middle">
                  <td className="px-4 py-3 text-right font-medium text-foreground"><div className="font-medium text-foreground">{user.fullName}</div>
                    <div className="text-xs text-muted-foreground">{user.email}</div>
                  </td>
                  <td className="px-4 py-3">
                    <UserTypeBadge type={user.accountType} />
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{user.packageName || "-"}</td>
                  <td className="px-4 py-3 text-muted-foreground">{user.packageType || "-"}</td>
                  <td className="px-4 py-3 text-muted-foreground">{formatJoinDate(user.startsAt)}</td>
                  <td className="px-4 py-3 text-muted-foreground">{formatJoinDate(user.endsAt)}</td>
                  <td className="px-4 py-3">
                    <UserActionsDropdown
                      onDeactivateSubscription={() =>
                        setPendingAction({
                          kind: "deactivate-subscription",
                          id: user.id,
                          fullName: user.fullName,
                        })
                      }
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
        onConfirm={onConfirmAction}
        isConfirming={isDeactivatingSubscription}
      />

      <PaginationControls
        currentPage={pagination?.current_page ?? currentPage}
        lastPage={pagination?.last_page ?? 1}
        total={pagination?.total}
        isLoading={isLoading || isFetching}
        onPageChange={(page) => {
          if (page < 1 || page > (pagination?.last_page ?? 1)) {
            return;
          }

          setCurrentPage(page);
        }}
      />
    </div>
  );
}
