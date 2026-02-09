import { useEffect } from "react"
import type {
  FieldPath,
  FieldValues,
  UseFormSetError,
} from "react-hook-form"

export const useApplyGlobalFormErrors = <TFieldValues extends FieldValues>(
  globalErrors: Record<string, string> | undefined,
  setError: UseFormSetError<TFieldValues>,
) => {
  useEffect(() => {
    if (!globalErrors) return

    Object.entries(globalErrors).forEach(([field, message]) => {
      setError(field as FieldPath<TFieldValues>, {
        type: "server",
        message,
      })
    })
  }, [globalErrors, setError])
}
