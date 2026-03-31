"use client";

import { useMemo, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { ConfirmationModal } from "./components/ConfirmationModal";
import { useSubscribingUsers } from "../hooks/useSubscribingUsers";
import { useDeactivateSubscription } from "../hooks/useDeactivateSubscription";
import { formatJoinDate } from "../utils/users";
import { UserTypeBadge } from "./components/UserTypeBadge";
import { UserActionsDropdown } from "./components/UserActionsDropdown";

type PendingAction = { kind: "deactivate-subscription"; id: string; fullName: string } | null;

const SKELETON_ROWS_COUNT = 10;

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
  const { users, isLoading, isFetching, isError } = useSubscribingUsers();
  const { mutateAsync: deactivateSubscription, isPending: isDeactivatingSubscription } =
    useDeactivateSubscription();

  const confirmationCopy = useMemo(() => getConfirmationCopy(pendingAction), [pendingAction]);

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

      <div className="overflow-x-auto rounded-xl border bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted/40 text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium text-right">الاسم</th>
              <th className="px-4 py-3 font-medium">نوع الحساب</th>
              <th className="px-4 py-3 font-medium">الباقة</th>
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
                    <Skeleton className="h-8 w-10" />
                  </td>
                </tr>
              ))}

            {!isLoading && !isFetching && isError && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-destructive">
                  تعذر تحميل بيانات الاشتراكات. حاول مرة أخرى.
                </td>
              </tr>
            )}

            {!isLoading && !isFetching && !isError && users.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">
                  لا يوجد مستخدمون مشتركون حالياً.
                </td>
              </tr>
            )}

            {!isLoading &&
              !isFetching &&
              !isError &&
              users.map((user) => (
                <tr key={user.id} className="border-t align-middle">
                  <td className="px-4 py-3 text-right font-medium text-foreground">{user.fullName}</td>
                  <td className="px-4 py-3">
                    <UserTypeBadge type={user.accountType} />
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{user.packageName || "-"}</td>
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
    </div>
  );
}
