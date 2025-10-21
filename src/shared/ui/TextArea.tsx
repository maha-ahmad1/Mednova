"use client"

import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface TextareaProps {
  label?: string
  rtl?: boolean
  error?: string
  placeholder?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
}

export function TextArea({
  label,
  rtl,
  error,
  placeholder,
  value,
  onChange,
}: TextareaProps) {
  return (
    <div className={cn("space-y-2 w-full ", rtl && "text-right")}>
      {label && <Label>{label}</Label>}

      <Textarea
        dir={rtl ? "rtl" : "ltr"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={cn(
          "w-full h-30 border border-gray-300 rounded-md p-3 hover:border-[#32A88D] focus-within:border-[#32A88D]",
          "border-gray-300 text-gray-800",
          "placeholder:text-gray-400"
        )}
      />

      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  )
}
