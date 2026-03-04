import { AxiosError } from "axios";

export interface ValidationErrorResponse {
  message?: string;
  data?: Record<string, string[]>;
}

export const getMutationErrorMessage = (error: AxiosError<ValidationErrorResponse | unknown>, fallback: string) => {
  const responseData = error.response?.data;
  const validationErrors = responseData?.data;
  const firstError = validationErrors ? Object.values(validationErrors)[0]?.[0] : undefined;

  return firstError || responseData?.message || fallback;
};
