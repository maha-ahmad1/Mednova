"use client";

import { useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { useNotificationStore } from "@/store/notificationStore";
import { useNavigationLoader } from "@/hooks/useNavigationLoader";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const ACCOUNT_STATUS_TYPES = ["account_approved", "account_rejected"];

/**
 * Surfaces the latest unread account approval/rejection event as a
 * dismiss-on-action card, mounted globally so it stays visible across
 * navigation until the user clicks through (it never auto-redirects).
 *
 * The action button disables itself via local state, not the shared
 * `isNavigating` flag — this card is mounted globally, so the global flag
 * can be true for navigations elsewhere that have nothing to do with this
 * button. The top NavigationProgress bar (triggered by `push`) is the only
 * loading indicator for the transition itself; the button never duplicates
 * it with its own spinner.
 */
export function AccountStatusNotificationCard() {
  const t = useTranslations("accountStatus");
  const notifications = useNotificationStore((state) => state.notifications);
  const markAsRead = useNotificationStore((state) => state.markAsRead);
  const { push } = useNavigationLoader();
  const [isPending, setIsPending] = useState(false);

  const activeNotification = notifications.find(
    (notification) =>
      !notification.read && ACCOUNT_STATUS_TYPES.includes(notification.type),
  );

  if (!activeNotification) return null;

  const isApproved = activeNotification.type === "account_approved";

  const handleAction = () => {
    setIsPending(true);
    markAsRead(activeNotification.id);
    push(isApproved ? "/profile" : "/profile/rejected");
  };

  return (
    <div className="fixed bottom-4 inset-x-4 sm:inset-x-auto sm:end-4 sm:w-96 z-[9998]">
      <div
        role="status"
        className={cn(
          "flex items-start gap-3 rounded-2xl border bg-white p-4 shadow-2xl text-start",
          isApproved ? "border-[#32A88D]/30" : "border-rose-200",
        )}
      >
        <div
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
            isApproved ? "bg-[#32A88D]/10" : "bg-rose-50",
          )}
        >
          {isApproved ? (
            <CheckCircle2 className="h-5 w-5 text-[#32A88D]" />
          ) : (
            <XCircle className="h-5 w-5 text-rose-600" />
          )}
        </div>

        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-800">
            {isApproved ? t("approvedTitle") : t("rejectedTitle")}
          </p>
          <p className="mt-1 text-sm text-gray-600 leading-relaxed">
            {isApproved ? t("approvedDescription") : t("rejectedDescription")}
          </p>
          <Button
            size="sm"
            disabled={isPending}
            onClick={handleAction}
            className={cn(
              "mt-3 h-auto rounded-lg px-4 py-1.5 text-xs",
              isApproved
                ? "bg-[#32A88D] hover:bg-[#2a8a7a] text-white"
                : "bg-rose-600 hover:bg-rose-700 text-white",
            )}
          >
            {isApproved ? t("approvedAction") : t("rejectedAction")}
          </Button>
        </div>
      </div>
    </div>
  );
}
