import { useEffect } from "react"
import type { FieldValues, UseFormReturn } from "react-hook-form"

export const useStepFormAutosave = <T extends FieldValues>(
  methods: UseFormReturn<T>,
  onSave: (values: Partial<T>) => void
) => {
  useEffect(() => {
    const subscription = methods.watch((values) => {
      onSave(values as Partial<T>)
    })

    return () => subscription.unsubscribe()
  }, [methods, onSave])
}
