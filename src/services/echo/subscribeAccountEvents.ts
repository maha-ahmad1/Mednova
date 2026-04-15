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
  instanceId?: string;
}

export const subscribeAccountEvents = ({
  accountChannel,
  userId,
  addNotification,
  updateSession,
  sessionUser,
  router,
  instanceId,
}: SubscribeAccountEventsParams): void => {
  console.debug("[EchoDebug][Account] attach-listener", {
    timestamp: new Date().toISOString(),
    eventType: ".account.status.updated",
    userId,
    instanceId,
  });
  accountChannel.listen(".account.status.updated", async (event: AccountStatusEvent) => {
    console.log("📢 حدث تحديث حالة الحساب:", event);
    console.log("🔥🔥🔥 حدث تحديث الحساب واصل:", event);

    const notification = createAccountStatusNotification(event);
    console.debug("[EchoDebug][Account] addNotification", {
      timestamp: new Date().toISOString(),
      userId,
      eventType: `.account.status.updated:${event.status}`,
      notificationId: notification.id,
      instanceId,
    });
    addNotification(notification);

    if (event.status === "approved") {
      toast.success(event.message || "تم قبول حسابك", {
        duration: 5000,
      });

      const updatedSession = await updateSession({
        approval_status: "approved",
        user: {
          ...(sessionUser || {}),
          approval_status: "approved",
        },
      });

      const isApproved =
        (updatedSession as { approval_status?: string } | null)?.approval_status ===
          "approved" ||
        (
          updatedSession as {
            user?: { approval_status?: string };
          } | null
        )?.user?.approval_status === "approved";

      if (isApproved && typeof window !== "undefined") {
        window.location.replace("/profile");
        return;
      }

      // router.replace("/profile");
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
