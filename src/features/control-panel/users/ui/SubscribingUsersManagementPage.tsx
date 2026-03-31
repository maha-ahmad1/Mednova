"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PaginationControls } from "@/shared/ui/components/PaginationControls";
import { ConfirmationModal } from "./components/ConfirmationModal";
import { useSubscribingUsers } from "../hooks/useSubscribingUsers";
import { useDeactivateSubscription } from "../hooks/useDeactivateSubscription";
import { formatJoinDate } from "../utils/users";
import { UserTypeBadge } from "./components/UserTypeBadge";
import { UserActionsDropdown } from "./components/UserActionsDropdown";

type PendingAction = { kind: "deactivate-subscription"; id: string; fullName: string } | null;

const SKELETON_ROWS_COUNT = 10;
const SUBSCRIBERS_PER_PAGE = 10;

type AccountTypeFilter = "all" | "Specialist" | "Center";
type StatusFilter = "all" | "active" | "expired";
type ExpiryFilter = "all" | "ending-soon" | "expired" | "active";

interface SubscribersFilters {
  search: string;
  accountType: AccountTypeFilter;
  status: StatusFilter;
  packageType: string;
  expiry: ExpiryFilter;
}

const initialFilters: SubscribersFilters = {
  search: "",
  accountType: "all",
  status: "all",
  packageType: "all",
  expiry: "all",
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
  const { users, isLoading, isFetching, isError, pagination } = useSubscribingUsers(
    currentPage,
    SUBSCRIBERS_PER_PAGE,
  );
  const { mutateAsync: deactivateSubscription, isPending: isDeactivatingSubscription } =
    useDeactivateSubscription();

  const confirmationCopy = useMemo(() => getConfirmationCopy(pendingAction), [pendingAction]);

  const packageTypeOptions = useMemo(
    () => Array.from(new Set(users.map((user) => user.packageType).filter((item) => item && item !== "-"))),
    [users],
  );

  const filteredUsers = useMemo(() => {
    const now = new Date();

    return users.filter((user) => {
      const searchTerm = filters.search.trim().toLowerCase();
      const searchMatches =
        searchTerm.length === 0 ||
        user.fullName.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm);

      if (!searchMatches) return false;

      if (filters.accountType !== "all" && user.accountType !== filters.accountType) {
        return false;
      }

      if (filters.packageType !== "all" && user.packageType !== filters.packageType) {
        return false;
      }

      const endsAtDate = new Date(user.endsAt);
      const isExpired = !Number.isNaN(endsAtDate.getTime()) && endsAtDate.getTime() < now.getTime();
      const sevenDaysFromNow = new Date(now);
      sevenDaysFromNow.setDate(now.getDate() + 7);
      const endsSoon =
        !isExpired &&
        !Number.isNaN(endsAtDate.getTime()) &&
        endsAtDate.getTime() <= sevenDaysFromNow.getTime();

      if (filters.status !== "all") {
        if (filters.status === "active" && isExpired) return false;
        if (filters.status === "expired" && !isExpired) return false;
      }

      if (filters.expiry !== "all") {
        if (filters.expiry === "ending-soon" && !endsSoon) return false;
        if (filters.expiry === "expired" && !isExpired) return false;
        if (filters.expiry === "active" && isExpired) return false;
      }

      return true;
    });
  }, [filters, users]);

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
        <div className="relative lg:col-span-2">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={filters.search}
            onChange={(event) => setFilters((prev) => ({ ...prev, search: event.target.value }))}
            placeholder="بحث بالاسم أو البريد الإلكتروني"
            className="w-full pl-10"
            dir="rtl"
          />
        </div>

        <Select
          value={filters.accountType}
          onValueChange={(value) => setFilters((prev) => ({ ...prev, accountType: value as AccountTypeFilter }))}
        >
          <SelectTrigger className="w-full"><SelectValue placeholder="نوع الحساب" /></SelectTrigger>
          <SelectContent className="text-right" dir="rtl">
            <SelectItem value="all">كل الأنواع</SelectItem>
            <SelectItem value="Specialist">مختص</SelectItem>
            <SelectItem value="Center">مركز</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.status}
          onValueChange={(value) => setFilters((prev) => ({ ...prev, status: value as StatusFilter }))}
        >
          <SelectTrigger className="w-full"><SelectValue placeholder="حالة الاشتراك" /></SelectTrigger>
          <SelectContent className="text-right" dir="rtl">
            <SelectItem value="all">كل الحالات</SelectItem>
            <SelectItem value="active">فعال</SelectItem>
            <SelectItem value="expired">منتهي</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex items-center gap-2">
          <Select
            value={filters.packageType}
            onValueChange={(value) => setFilters((prev) => ({ ...prev, packageType: value }))}
          >
            <SelectTrigger className="w-full"><SelectValue placeholder="نوع الباقة" /></SelectTrigger>
            <SelectContent className="text-right" dir="rtl">
              <SelectItem value="all">كل الباقات</SelectItem>
              {packageTypeOptions.map((item) => (
                <SelectItem key={item} value={item}>{item}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button variant="outline" onClick={() => setFilters(initialFilters)}>مسح</Button>
        </div>

        <Select
          value={filters.expiry}
          onValueChange={(value) => setFilters((prev) => ({ ...prev, expiry: value as ExpiryFilter }))}
        >
          <SelectTrigger className="w-full"><SelectValue placeholder="انتهاء الاشتراك" /></SelectTrigger>
          <SelectContent className="text-right" dir="rtl">
            <SelectItem value="all">الكل</SelectItem>
            <SelectItem value="ending-soon">ينتهي قريباً</SelectItem>
            <SelectItem value="expired">منتهي</SelectItem>
            <SelectItem value="active">فعال</SelectItem>
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

            {!isLoading && !isFetching && !isError && filteredUsers.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-muted-foreground">
                  لا يوجد مستخدمون مشتركون حالياً.
                </td>
              </tr>
            )}

            {!isLoading &&
              !isFetching &&
              !isError &&
              filteredUsers.map((user) => (
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
