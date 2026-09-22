export function bucketEndReason(endReason: string): "completed" | "abandoned" | "cancelled" {
  if (endReason === "completed" || endReason === "stopped_by_therapist") return "completed";
  if (endReason === "cancelled_by_doctor") return "cancelled";
  return "abandoned"; // stopped_by_patient, pain, disconnected, timeout, technical_error
}
