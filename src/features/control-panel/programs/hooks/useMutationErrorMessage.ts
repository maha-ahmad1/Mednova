import { AxiosError } from "axios";

export interface ValidationErrorResponse {
  message?: string;
  data?: Record<string, string[]>;
}

const isValidationErrorResponse = (value: unknown): value is ValidationErrorResponse => {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  const hasValidMessage = candidate.message === undefined || typeof candidate.message === "string";
  const hasValidData = candidate.data === undefined || typeof candidate.data === "object";

  return hasValidMessage && hasValidData;
};

export const getMutationErrorMessage = (error: AxiosError<unknown>, fallback: string) => {
  const responseData = error.response?.data;

  if (!isValidationErrorResponse(responseData)) {
    return fallback;
  }

  const validationErrors = responseData.data;
  const firstError = validationErrors ? Object.values(validationErrors)[0]?.[0] : undefined;

  return firstError || responseData.message || fallback;
};
