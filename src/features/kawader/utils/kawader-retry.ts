import axios from "axios";

// A 4xx (404 for a missing or foreign request, 403...) will not change on retry, so don't make
// the user wait through React Query's default retries before showing the error.
export const shouldRetryKawaderQuery = (failureCount: number, error: unknown): boolean => {
  if (axios.isAxiosError(error) && error.response && error.response.status < 500) return false;
  return failureCount < 2;
};
