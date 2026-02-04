import { useEffect } from "react"
import type { FieldValues, Path, UseFormReturn } from "react-hook-form"

import type { ServerFieldErrors } from "../utils/serverValidation"

type UseClearServerErrorsOptions<TFieldValues extends FieldValues> = {
  methods: UseFormReturn<TFieldValues>
  errors?: ServerFieldErrors
  setErrors?: (errors: ServerFieldErrors) => void
  fields?: readonly Path<TFieldValues>[]
}

export const useClearServerErrorsOnChange = <TFieldValues extends FieldValues>({
  methods,
  errors,
  setErrors,
  fields,
}: UseClearServerErrorsOptions<TFieldValues>) => {
  useEffect(() => {
    if (!setErrors || !errors) {
      return
    }

    const subscription = methods.watch((_, { name }) => {
      if (!name) {
        return
      }
      if (fields && !fields.includes(name as Path<TFieldValues>)) {
        return
      }
      if (!errors[name]) {
        return
      }
      methods.clearErrors(name as Path<TFieldValues>)
      setErrors(
        Object.fromEntries(
          Object.entries(errors).filter(([field]) => field !== name)
        )
      )
    })

    return () => subscription.unsubscribe()
  }, [errors, fields, methods, setErrors])
}
