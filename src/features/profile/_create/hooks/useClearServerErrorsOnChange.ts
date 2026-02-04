import { useEffect } from "react"
import type { FieldValues, Path, UseFormReturn } from "react-hook-form"

import type { ServerFieldErrors } from "../utils/serverValidation"

type UseClearServerErrorsOptions<TFieldValues extends FieldValues> = {
  methods: UseFormReturn<TFieldValues>
  setErrors?: (errors: ServerFieldErrors) => void
  fields?: readonly Path<TFieldValues>[]
}

export const useClearServerErrorsOnChange = <TFieldValues extends FieldValues>({
  methods,
  setErrors,
  fields,
}: UseClearServerErrorsOptions<TFieldValues>) => {
  useEffect(() => {
    if (!setErrors) {
      return
    }

    const subscription = methods.watch((_, { name }) => {
      if (!name) {
        return
      }
      if (fields && !fields.includes(name as Path<TFieldValues>)) {
        return
      }
      setErrors((prev) => {
        if (!prev[name]) {
          return prev
        }
        methods.clearErrors(name as Path<TFieldValues>)
        const { [name]: _, ...rest } = prev
        return rest
      })
    })

    return () => subscription.unsubscribe()
  }, [fields, methods, setErrors])
}
