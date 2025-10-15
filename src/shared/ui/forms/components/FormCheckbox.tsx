import * as React from "react"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

export interface FormCheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: React.ReactNode
  error?: string
  rtl?: boolean
  containerClassName?: string
}

const FormCheckbox = React.forwardRef<HTMLInputElement, FormCheckboxProps>(
  ({ label, error, rtl = false, containerClassName, className, id, ...props }, ref) => {
    const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`

    return (
      <div className={cn("space-y-2", containerClassName)} dir={rtl ? "rtl" : "ltr"}>
        <div className={cn("flex items-start gap-2", rtl )}>
          <input
            type="checkbox"
            id={checkboxId}
            ref={ref}
            className={cn("mt-1 rounded border-border cursor-pointer", error && "border-red-500", className)}
            {...props}
          />
          {label && (
            <Label
              htmlFor={checkboxId}
              className={cn("text-sm text-muted-foreground cursor-pointer", rtl && "text-right")}
            >
              {label}
            </Label>
          )}
        </div>
        {error && <p className={cn("text-sm text-red-500", rtl && "text-right")}>{error}</p>}
      </div>
    )
  },
)

FormCheckbox.displayName = "FormCheckbox"

export { FormCheckbox }
