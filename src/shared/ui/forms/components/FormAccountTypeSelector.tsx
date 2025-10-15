"use client"

import * as React from "react"
import { Label } from "@/components/ui/label"
import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export interface AccountTypeOption {
  value: string
  label: string
  icon: LucideIcon
}

export interface FormAccountTypeSelectorProps {
  label?: string
  options: AccountTypeOption[]
  value: string
  onChange: (value: string) => void
  error?: string
  rtl?: boolean
  containerClassName?: string
}

const FormAccountTypeSelector = React.forwardRef<HTMLDivElement, FormAccountTypeSelectorProps>(
  ({ label, options, value, onChange, error, rtl = false, containerClassName }, ref) => {
    return (
      <div ref={ref} className={cn("space-y-3", containerClassName)} dir={rtl ? "rtl" : "ltr"}>
        {label && <Label className={cn("block", rtl && "text-right")}>{label}</Label>}
        <div className="grid grid-cols-3 gap-3">
          {options.map((option) => {
            const Icon = option.icon
            const isSelected = value === option.value

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => onChange(option.value)}
                className={cn(
                  "flex flex-col items-center justify-center gap-2 p-4 rounded-lg border-2 transition-all",
                  isSelected
                    ? "border-[#32A88D] bg-[#F0FDF4] text-[#32A88D]"
                    : "border-border bg-card hover:border-[#32A88D] hover:bg-[#F0FDF4] hover:text-[#32A88D]",
                )}
              >
                <Icon className="w-6 h-6" />
                <span className="text-xs font-medium">{option.label}</span>
              </button>
            )
          })}
        </div>
        {error && <p className={cn("text-sm text-red-500", rtl && "text-right")}>{error}</p>}
      </div>
    )
  },
)

FormAccountTypeSelector.displayName = "FormAccountTypeSelector"

export { FormAccountTypeSelector }
