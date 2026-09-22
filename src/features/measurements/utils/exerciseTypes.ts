// Canonical machine codes stabilized by Thero's backend refactor — replaces the old
// free-text/placeholder list to kill the substring-matching bug it caused. Always send
// the code (e.g. "SHOULDER_FLEXION") as `exercise_type`, never the display label.
// NOTE: Arabic labels in messages/ar.json for these keys are a draft translation and
// have not been clinically reviewed — confirm with Nada / the clinical lead before ship.
export const EXERCISE_TYPE_CODES = [
  "SHOULDER_FLEXION",
  "ELBOW_FLEXION",
  "HIP_FLEXION",
  "KNEE_FLEXION",
  "ANKLE_DORSIFLEXION",
  "WRIST_REHAB",
  "BALANCE",
  "HAND_GRIP",
] as const;

export type ExerciseTypeCode = (typeof EXERCISE_TYPE_CODES)[number];

export const EXERCISE_TYPES: { value: ExerciseTypeCode; labelKey: string }[] = [
  { value: "SHOULDER_FLEXION", labelKey: "shoulderFlexion" },
  { value: "ELBOW_FLEXION", labelKey: "elbowFlexion" },
  { value: "HIP_FLEXION", labelKey: "hipFlexion" },
  { value: "KNEE_FLEXION", labelKey: "kneeFlexion" },
  { value: "ANKLE_DORSIFLEXION", labelKey: "ankleDorsiflexion" },
  { value: "WRIST_REHAB", labelKey: "wristRehab" },
  { value: "BALANCE", labelKey: "balance" },
  { value: "HAND_GRIP", labelKey: "handGrip" },
];
