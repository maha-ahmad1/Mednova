import { AxiosError } from 'axios'

interface ApiErrorResponse {
  message?: string
  data?: Record<string, string[]>
}

export const extractFieldError = (
  error: AxiosError<ApiErrorResponse>,
  fallbackMessage = 'حدث خطأ غير متوقع.'
): string => {
  const responseData = error.response?.data

  if (error.response?.status === 422 && responseData?.data) {
    const errorData = responseData.data

    for (const key in errorData) {
      const messages = errorData[key]
      if (Array.isArray(messages) && messages.length > 0) {
        return messages[0]
      }
    }
  }

  return responseData?.message || fallbackMessage
}
