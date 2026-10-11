import type { QueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createProgramReviewNotification, type ProgramReviewEvent } from "@/utils/notificationFactory";
import type { Notification } from "@/store/notificationStore";

interface Channel {
  listen: (event: string, callback: (payload: unknown) => void) => void;
}

interface SubscribeProgramReviewEventsParams {
  channel: Channel;
  queryClient: QueryClient;
  addNotification: (notification: Notification) => void;
}

// Reuses the existing consultant.{id} channel (already opened in useEchoNotifications.ts
// for consultation/measurement events) — this only attaches one more listener to it, no
// new Echo connection or channel subscription.
//
// Open questions for backend (built defensively against the current best guess until
// confirmed — see ProgramReviewEvent in notificationFactory.ts):
// 1. Exact `program.review` payload shape — assumed { program_id, title, status, rejection_reason? }
//    based on the review-queue REST contract's field names.
// 2. Whether this event is also persisted to the notifications table that feeds the bell
//    (useNotificationsDropdownQuery) or is broadcast-only. If broadcast-only, a specialist who
//    has the tab closed when the event fires has no way to see it later — this toast/store
//    entry is the only record.
export function subscribeProgramReviewEvents({
  channel,
  queryClient,
  addNotification,
}: SubscribeProgramReviewEventsParams): void {
  channel.listen("program.review", (payload: unknown) => {
    const event = payload as ProgramReviewEvent;

    console.debug("[EchoDebug][ProgramReview] program.review received", {
      timestamp: new Date().toISOString(),
      programId: event.program_id,
      status: event.status,
    });

    const notification = createProgramReviewNotification(event);
    addNotification(notification);

    queryClient.invalidateQueries({ queryKey: ["consultant-programs"] });
    queryClient.invalidateQueries({ queryKey: ["consultant-program", event.program_id] });

    if (event.status === "approved") {
      toast.success(`تمت الموافقة على كورسك "${event.title}"`);
    } else {
      toast.error(`تم رفض كورسك "${event.title}"`, {
        description: event.rejection_reason ?? undefined,
      });
    }
  });
}
