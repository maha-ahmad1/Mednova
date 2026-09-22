const KNOWN_KEYS = [
  "NOT_FOUND",
  "ERROR_OCCURRED",
  "CREATE_SUCCESS",
  "STATUS_UPDATED",
  "DATA_RETRIEVED_SUCCESSFULLY",
  "UNAUTHORIZED_CONSULTATION_ACTION",
];

export function resolveApiMessage(
  message: string,
  t: (key: string) => string,
): string {
  if (KNOWN_KEYS.includes(message)) {
    return t(`measurements.apiMessages.${message}`); // add these keys to ar.json/en.json
  }
  return message; // already a full sentence from the backend, display as-is
}
