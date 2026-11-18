import type { AxiosError } from "axios";

type ReviewErrorBody = {
  message?: string;
  data?: Record<string, unknown> | null;
};

// The rating API reports validation errors as
// { message: "ERROR OCCURRED", data: { field: "msg" } }.
// 403 = the user isn't allowed to review this item (e.g. not enrolled / no consultation):
// always show our own translated explanation, since the backend text isn't localized.
// Otherwise prefer the first field message, then `message`, then the translated fallback.
export function getReviewErrorMessage(
  error: AxiosError,
  fallback: string,
  forbiddenMessage?: string,
): string {
  if (error.response?.status === 403 && forbiddenMessage) return forbiddenMessage;

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
