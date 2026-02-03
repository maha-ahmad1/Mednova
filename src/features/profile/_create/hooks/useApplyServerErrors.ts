import { useEffect } from "react"
import type { FieldValues, Path, UseFormSetError } from "react-hook-form"

import type { ServerFieldErrors } from "../utils/serverValidation"

type UseApplyServerErrorsOptions<TFieldValues extends FieldValues> = {
  errors?: ServerFieldErrors
  setError: UseFormSetError<TFieldValues>
  fields?: readonly Path<TFieldValues>[]
}

export const useApplyServerErrors = <TFieldValues extends FieldValues>({
  errors,
  setError,
  fields,
}: UseApplyServerErrorsOptions<TFieldValues>) => {
  useEffect(() => {
    if (!errors) {
      return
    }

    Object.entries(errors).forEach(([field, message]) => {
      if (!message) {
        return
      }
      if (fields && !fields.includes(field as Path<TFieldValues>)) {
        return
      }
      setError(field as Path<TFieldValues>, { type: "server", message })
    })
  }, [errors, fields, setError])
}
