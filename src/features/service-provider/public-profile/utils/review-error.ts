import type { AxiosError } from "axios";

type ReviewErrorBody = {
  message?: string;
  data?: Record<string, unknown> | null;
};

// The rating API reports validation errors as
// { message: "ERROR OCCURRED", data: { field: "msg" } }.
// Prefer the first field message, then `message`, then the translated fallback.
export function getReviewErrorMessage(error: AxiosError, fallback: string): string {
  const body = error.response?.data as ReviewErrorBody | undefined;

  const first =
    body?.data && typeof body.data === "object"
      ? Object.values(body.data)[0]
      : undefined;
  const fieldMessage = Array.isArray(first) ? first[0] : first;

  if (typeof fieldMessage === "string" && fieldMessage.trim()) return fieldMessage;
  if (typeof body?.message === "string" && body.message.trim()) return body.message;
  return fallback;
}
