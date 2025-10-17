"use client";
import * as React from "react"
import { SelectHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";

interface FormSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  rtl?: boolean;
  error?: string;
  options: { value: string; label: string }[];
  labelClassName?: string

}

export const FormSelect = forwardRef<HTMLSelectElement, FormSelectProps>(
  (
    { label, rtl, error, options, className,labelClassName, ...props },
    ref
  ) => {
    const inputId = React.useId();

    return (
      <div className={cn("flex flex-col gap-1", rtl && "text-right")}>
        {label && (
          <Label
            htmlFor={inputId}
            className={cn("block", rtl && "text-right", error, labelClassName)}
          >
            {label}
          </Label>
        )}

        <select
          ref={ref}
          {...props}
          className={cn(
            "border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-[#32A88D] focus:border-[#32A88D] outline-none text-gray-800 ",
            error && "border-red-500",
            rtl && "text-right",
            className
          )}
        >
          <option value="">اختر...</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {error && <span className="text-sm text-red-500">{error}</span>}
      </div>
    );
  }
);

FormSelect.displayName = "FormSelect";
