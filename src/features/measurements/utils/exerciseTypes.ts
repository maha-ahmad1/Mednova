// TODO: backend has NOT provided an authoritative list — `exercise_type` is validated
// server-side only by `max:100` (free string, no enum). This constant is a placeholder
// until product/backend confirms the real list Thero supports. Keep this file isolated
// so swapping the list later is a one-file change.
export const EXERCISE_TYPES = [
  { value: "shoulder_flexion", labelKey: "shoulderFlexion" },
  { value: "elbow_extension", labelKey: "elbowExtension" },
  { value: "wrist_rotation", labelKey: "wristRotation" },
  { value: "knee_flexion", labelKey: "kneeFlexion" },
] as const;
