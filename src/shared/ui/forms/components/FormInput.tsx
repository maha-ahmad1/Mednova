"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

export interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: LucideIcon
  iconPosition?: "left" | "right"
  rtl?: boolean
  containerClassName?: string
  labelClassName?: string
}

const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  (
    {
      label,
      error,
      icon: Icon,
      iconPosition = "left",
      rtl = false,
      className,
      containerClassName,
      labelClassName,
      id,
      ...props
    },
    ref,
  ) => {
    const inputId = React.useId()

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
          {Icon && iconPosition === "left" && (
            <div
              className={cn(
                "absolute top-1/2 -translate-y-1/2 flex items-center pointer-events-none",
                rtl ? "right-3" : "left-3",
              )}
            >
              <Icon className="h-4 w-4 text-muted-foreground" />
            </div>
          )}
          <Input
            id={inputId}
            ref={ref}
            className={cn(
              Icon && iconPosition === "left" && (rtl ? "pr-10" : "pl-10"),
              Icon && iconPosition === "right" && (rtl ? "pl-10" : "pr-10"),
              rtl && "text-right",
              error && "border-destructive focus-visible:ring-destructive",
              className,
            )}
            dir={rtl ? "rtl" : undefined}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : undefined}
            {...props}
          />
          {Icon && iconPosition === "right" && (
            <div
              className={cn(
                "absolute top-1/2 -translate-y-1/2 flex items-center pointer-events-none",
                rtl ? "left-3" : "right-3",
              )}
            >
              <Icon className="h-4 w-4 text-muted-foreground" />
            </div>
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
FormInput.displayName = "FormInput"

export { FormInput }
