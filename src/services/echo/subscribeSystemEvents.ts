import { toast } from "sonner";
import type { Notification } from "@/store/notificationStore";
import {
  createSystemNotification,
  type SystemNotificationEvent,
} from "@/utils/notificationFactory";

interface SubscribeSystemEventsParams {
  publicChannel: {
    listen: (event: string, callback: (payload: SystemNotificationEvent) => void) => void;
  };
  addNotification: (notification: Notification) => void;
}

export const subscribeSystemEvents = ({
  publicChannel,
  addNotification,
}: SubscribeSystemEventsParams): void => {
  publicChannel.listen("SystemNotification", (event: SystemNotificationEvent) => {
    console.log("📡 EVENT RECEIVED", {
      channel: "system",
      eventType: "SystemNotification",
      consultationId:
        (event as { consultation_id?: number; id?: number })?.consultation_id ||
        (event as { id?: number })?.id,
      status: (event as { status?: string })?.status,
      rawEvent: event,
    });

    const notification = createSystemNotification(event, "pusher-system");
    addNotification(notification);

    toast.info(event.message, {
      duration: 5000,
      position: "top-center",
    });
  });
};
