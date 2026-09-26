import type { QueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { mapMeasurementOutcome } from "@/features/measurements/utils/mapSessionOutcome";
import { createMeasurementNotification } from "@/utils/notificationFactory";
import type {
  MeasurementEndedEventConsultant,
  MeasurementEndedEventPatient,
} from "@/features/measurements/types";
import type { Notification } from "@/store/notificationStore";
import { useMeasurementLiveStore } from "@/store/measurementLiveStore";

interface Channel {
  listen: (event: string, callback: (payload: unknown) => void) => void;
}

interface SubscribeMeasurementEventsParams {
  channel: Channel;
  role: "patient" | "therapist" | "rehabilitation_center";
  queryClient: QueryClient;
  addNotification: (notification: Notification) => void;
  /** Translator scoped to the full message tree (called with "measurements.*" keys). */
  t: (key: string, values?: Record<string, string | number | Date>) => string;
}

export function subscribeMeasurementEvents({
  channel,
  role,
  queryClient,
  addNotification,
  t,
}: SubscribeMeasurementEventsParams): void {
  // Registered with a leading dot, same as subscribeAccountEvents.ts's
  // ".account.status.updated" — Laravel broadcasts this as a plain event name
  // (not a namespaced class), so the dot must be included or the listener
  // silently never fires.
  channel.listen(".measurement.ended", (payload: unknown) => {
    const event = payload as MeasurementEndedEventPatient | MeasurementEndedEventConsultant;

    console.debug("[EchoDebug][Measurement] measurement.ended received", {
      timestamp: new Date().toISOString(),
      role,
      measurementId: event.measurement_id,
      consultationId: event.consultation_id,
      status: event.status,
      endReason: event.end_reason,
    });

    queryClient.invalidateQueries({
      queryKey: ["measurements", event.consultation_type, event.consultation_id],
    });

    // Lets a mounted MeasurementSection tell this live arrival apart from a
    // result that was already there on load, and ignore it if it belongs to
    // a different consultation than the one currently open.
    useMeasurementLiveStore.getState().setLastArrival({
      type: event.consultation_type,
      consultationId: event.consultation_id,
    });

    const outcome = mapMeasurementOutcome(event.status, event.end_reason);
    const isPatient = role === "patient";
    const body = t(`measurements.notifications.${outcome.key}.${isPatient ? "patient" : "consultant"}`);

    const notification = createMeasurementNotification(event, outcome, body);
    addNotification(notification);

    if (outcome.needsElevatedAttention) {
      toast.warning(body, { duration: 6000, position: "top-center" });
    } else {
      toast.info(body, { duration: 5000, position: "top-center" });
    }
  });
}
