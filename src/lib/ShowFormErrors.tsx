"use client"

import { toast } from "sonner"

/**
 * Display form errors using Sonner toast notifications
 *
 * @param errors - Array of error messages to display
 * @param title - Optional title for the toast (defaults to "خطأ في البيانات")
 */
export function showFormErrors(errors: string[], title?: string) {
  if (errors.length === 0) return

  const cleanErrors = errors.filter(Boolean).map((err) => String(err).trim()) 

  if (cleanErrors.length === 0) return 

  //  Single error
  if (cleanErrors.length === 1) {
    toast.error(title || cleanErrors[0])
    return
  }

  //  Multiple errors
  toast.error(
    <div className="flex flex-col gap-2">
      {title && <p className="font-semibold">{title}</p>}
      <ul className="list-disc list-inside space-y-1">
        {cleanErrors.map((error, idx) => (
          <li key={idx}>{error}</li>
        ))}
      </ul>
    </div>,
    {
      duration: 5000,
    },
  )
}

/**
 * Display a single error message using Sonner toast
 *
 * @param error - Error message to display
 */
export function showFormError(error: string) {
  toast.error(error, {
    duration: 4000,
    position: "top-center",
  })
}
