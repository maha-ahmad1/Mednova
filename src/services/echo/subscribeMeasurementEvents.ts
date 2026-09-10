import type { QueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { bucketEndReason } from "@/features/measurements/utils/mapEndReason";
import { EXERCISE_TYPES } from "@/features/measurements/utils/exerciseTypes";
import type { MeasurementCompletedPayload } from "@/features/measurements/types";

interface Channel {
  listen: (
    event: string,
    callback: (payload: MeasurementCompletedPayload) => void,
  ) => void;
}

interface SubscribeMeasurementEventsParams {
  channel: Channel;
  queryClient: QueryClient;
  /** Translator scoped to the full message tree (called with "measurements.*" keys). */
  t: (key: string, values?: Record<string, string | number | Date>) => string;
}

// exercise_type on the wire is the raw snake_case backend value (e.g.
// "shoulder_flexion"), but the i18n keys under measurements.exerciseTypes.*
// are camelCase (see exerciseTypes.ts) — go through that mapping rather than
// assuming the raw value doubles as a translation key. Falls back to the raw
// value for exercise types outside the known list (backend has no enum).
const resolveExerciseLabel = (
  exerciseType: string,
  t: (key: string, values?: Record<string, string | number | Date>) => string,
): string => {
  const known = EXERCISE_TYPES.find((entry) => entry.value === exerciseType);
  return known
    ? t(`measurements.exerciseTypes.${known.labelKey}`)
    : exerciseType;
};

export function subscribeMeasurementEvents({
  channel,
  queryClient,
  t,
}: SubscribeMeasurementEventsParams): void {
  channel.listen(".measurement.completed", (payload: MeasurementCompletedPayload) => {
    const type = payload.consultation_type.includes("Video") ? "video" : "chat";

    queryClient.invalidateQueries({
      queryKey: ["measurements", type, payload.consultation_id],
    });

    const bucket = bucketEndReason(payload.end_reason);
    const exerciseLabel = resolveExerciseLabel(payload.exercise_type, t);

    if (bucket === "completed") {
      toast.success(t("measurements.pusher.completed", { exercise: exerciseLabel }));
    } else if (bucket === "cancelled") {
      toast.info(t("measurements.pusher.cancelled", { exercise: exerciseLabel }));
    } else {
      toast.warning(t("measurements.pusher.abandoned", { exercise: exerciseLabel }));
    }
  });
}
