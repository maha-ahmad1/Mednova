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
  /** Translator scoped to the "accountStatus" message namespace. */
  t: (key: string) => string;
  instanceId?: string;
}

/**
 * Listens for account approval/rejection events. Intentionally does NOT
 * auto-redirect — the session is updated in the background so route guards
 * stay accurate, while the user keeps control via the persistent
 * AccountStatusNotificationCard (which renders the "Go to Profile" /
 * "View Details" actions and drives the navigation progress bar).
 */
export const subscribeAccountEvents = ({
  accountChannel,
  userId,
  addNotification,
  updateSession,
  sessionUser,
  t,
  instanceId,
}: SubscribeAccountEventsParams): void => {
  console.debug("[EchoDebug][Account] attach-listener", {
    timestamp: new Date().toISOString(),
    eventType: ".account.status.updated",
    userId,
    instanceId,
  });

  accountChannel.listen(".account.status.updated", async (event: AccountStatusEvent) => {
    console.debug("[EchoDebug][Account] event-received", {
      timestamp: new Date().toISOString(),
      userId,
      instanceId,
      event,
    });

    if (event.status !== "approved" && event.status !== "rejected") {
      return;
    }

    const isApproved = event.status === "approved";
    const title = isApproved ? t("approvedTitle") : t("rejectedTitle");
    // Backend message is the source of truth — only fall back to translated
    // copy when the backend doesn't provide one.
    const description =
      event.message?.trim() ||
      (isApproved ? t("approvedDescription") : t("rejectedDescription"));

    addNotification(createAccountStatusNotification(event, title, description));

    if (isApproved) {
      toast.success(title, { description, duration: 6000 });
    } else {
      toast.error(title, { description, duration: 6000 });
    }

    await updateSession({
      approval_status: event.status,
      user: {
        ...(sessionUser || {}),
        approval_status: event.status,
      },
    });
  });

  accountChannel.subscribed(() => {
    console.debug("[EchoDebug][Account] subscribed", `customer.${userId}`);
  });

  accountChannel.error((error: unknown) => {
    console.error("[EchoDebug][Account] subscription-error", error);
  });
};
