"use client"

import { toast } from "sonner"

export function showFormErrors(errors: string[]) {
  if (errors.length === 0) return

  toast.error(
    <div className="flex flex-col gap-2">
      {errors.length === 1 ? (
        <p>{errors[0]}</p>
      ) : (
        <ul className="list-disc list-inside space-y-1">
          {errors.map((error, idx) => (
            <li key={idx}>{error}</li>
          ))}
        </ul>
      )}
    </div>
  )
}
