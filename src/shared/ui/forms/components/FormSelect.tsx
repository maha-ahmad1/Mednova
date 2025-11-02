"use client";

import * as React from "react";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

interface FormSelectProps {
  label?: string;
  rtl?: boolean;
  error?: string;
  options: { value: string; label: string }[];
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  labelClassName?: string;
  className?: string;
  disabled?: boolean;
}

export const FormSelect = forwardRef<HTMLButtonElement, FormSelectProps>(
  (
    {
      label,
      rtl,
      error,
      options,
      value,
      onValueChange,
      placeholder = "أختر",
      labelClassName,
      className,
      disabled,
    },
    ref
  ) => {
    const selectId = React.useId();

    return (
      <div className={cn("flex flex-col gap-1", rtl && "text-right")}>
        {label && (
          <Label
            htmlFor={selectId}
            className={cn("block", rtl && "text-right", labelClassName)}
          >
            {label}
          </Label>
        )}

        <Select value={value} onValueChange={onValueChange}>
          <SelectTrigger
            ref={ref}
            id={selectId}
            dir={rtl ? "rtl" : "ltr"}
            className={cn(
              "flex h-14 w-full items-center justify-between rounded-md border border-gray-200 bg-white p-5.5 !focus:ring-0 !focus:ring-[#32A88D] !focus:border-[#32A88D]",
              error && "border-red-500 focus:ring-red-500",
              className
            )}
              disabled={disabled}
          >
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>

          <SelectContent className={cn("max-h-36 overflow-auto")}>
            {options.map((opt) => (
              <SelectItem className="flex-row-reverse " key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {error && <span className="text-sm text-red-500">{error}</span>}
      </div>
    );
  }
);

FormSelect.displayName = "FormSelect";