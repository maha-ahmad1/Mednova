"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Eye, EyeOff } from "lucide-react"

export interface FormPasswordInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string
  error?: string
  rtl?: boolean
  containerClassName?: string
  labelClassName?: string
  showToggle?: boolean
}

const FormPasswordInput = React.forwardRef<HTMLInputElement, FormPasswordInputProps>(
  (
    { label, error, rtl = false, className, containerClassName, labelClassName, showToggle = true, id, ...props },
    ref,
  ) => {
    const inputId = React.useId()
    const [showPassword, setShowPassword] = React.useState(false)

    const togglePasswordVisibility = () => setShowPassword(!showPassword)

    return (
      <div className={cn("space-y-2", containerClassName)} dir={rtl ? "rtl" : undefined}>
        {label && (
          <Label
            htmlFor={inputId}
            className={cn("block", rtl && "text-right", error && "text-destructive", labelClassName)}
          >
            {label}
          </Label>
        )}
        <div className="relative">
          <Input
            id={inputId}
            ref={ref}
            type={showPassword ? "text" : "password"}
            className={cn(
              showToggle && (rtl ? "pl-10" : "pr-10"),
              rtl && "text-right",
              error && "border-destructive focus-visible:ring-destructive",
              className,
            )}
            dir={rtl ? "rtl" : undefined}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : undefined}
            {...props}
          />
          {showToggle && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className={cn(
                "absolute top-1/2 -translate-y-1/2 h-7 w-7 p-0 hover:bg-transparent",
                rtl ? "left-2" : "right-2",
              )}
              onClick={togglePasswordVisibility}
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Eye className="h-4 w-4 text-muted-foreground" />
              )}
              <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
            </Button>
          )}
        </div>
        {error && (
          <p id={`${inputId}-error`} className={cn("text-sm text-destructive", rtl && "text-right")}>
            {error}
          </p>
        )}
      </div>
    )
  },
)
FormPasswordInput.displayName = "FormPasswordInput"

export { FormPasswordInput }
