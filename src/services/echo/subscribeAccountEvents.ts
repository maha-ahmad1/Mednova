import { toast } from "sonner";
import type { Notification } from "@/store/notificationStore";
import { createAccountStatusNotification } from "@/utils/notificationFactory";

interface AccountStatusEvent {
  status: string;
  reason?: string;
  message?: string;
}

interface SubscribeAccountEventsParams {
  accountChannel: {
    listen: (event: string, callback: (payload: AccountStatusEvent) => void) => void;
    subscribed: (callback: () => void) => void;
    error: (callback: (error: unknown) => void) => void;
  };
  userId: number | string;
  addNotification: (notification: Notification) => void;
  updateSession: (data: {
    approval_status: string;
    user: Record<string, unknown>;
  }) => Promise<unknown>;
  sessionUser: Record<string, unknown> | undefined;
  router: {
    replace: (href: string) => void;
    refresh: () => void;
  };
}

export const subscribeAccountEvents = ({
  accountChannel,
  userId,
  addNotification,
  updateSession,
  sessionUser,
  router,
}: SubscribeAccountEventsParams): void => {
  accountChannel.listen(".account.status.updated", async (event: AccountStatusEvent) => {
    console.log("📢 حدث تحديث حالة الحساب:", event);
    console.log("🔥🔥🔥 حدث تحديث الحساب واصل:", event);

    const notification = createAccountStatusNotification(event);
    addNotification(notification);

    if (event.status === "approved") {
      toast.success(event.message || "تم قبول حسابك", {
        duration: 5000,
      });

      await updateSession({
        approval_status: "approved",
        user: {
          ...(sessionUser || {}),
          approval_status: "approved",
        },
      });

      router.replace("/profile");
      router.refresh();
    }

    if (event.status === "rejected") {
      toast.error(event.message || "تم رفض حسابك", {
        duration: 5000,
      });

      router.replace("/profile/rejected");
    }
  });

  accountChannel.subscribed(() => {
    console.log("✅ تم الاشتراك بنجاح في قناة accountChannel", `customer.${userId}`);
  });

  accountChannel.error((error: unknown) => {
    console.error("❌ خطأ في accountChannel:", error);
  });
};
