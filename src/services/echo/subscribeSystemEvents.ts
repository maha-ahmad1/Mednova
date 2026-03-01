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
    console.log("🔔 إشعار نظامي:", event);
    const notification = createSystemNotification(event);
    addNotification(notification);

    toast.info(event.message, {
      duration: 5000,
      position: "top-center",
    });
  });
};
