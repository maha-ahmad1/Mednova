"use client"

import * as React from "react"
import { FormSelect } from "./FormSelect"
import { FormInput } from "./FormInput"
import { Button } from "@/components/ui/button"

interface FormCitySelectProps {
  cities: string[]
  value: string
  onValueChange: (value: string) => void
  label?: string
  placeholder?: string
  disabled?: boolean
  rtl?: boolean
  error?: string
  className?: string
}

export function FormCitySelect({
  cities,
  value,
  onValueChange,
  label = "المدينة",
  placeholder,
  disabled,
  rtl = true,
  error,
  className,
}: FormCitySelectProps) {
  const isKnownCity = value === "" || cities.includes(value)
  const [manualMode, setManualMode] = React.useState(!isKnownCity)

  // If the city list changes (country switched) and the current value
  // isn't in the new list, don't silently force manual mode — the
  // parent already resets value to "" on country change, so just
  // resync when that happens.
  React.useEffect(() => {
    if (value === "") setManualMode(false)
  }, [cities]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleSelectChange = (val: string) => {
    if (val === "أخرى") {
      setManualMode(true)
      onValueChange("")
    } else {
      onValueChange(val)
    }
  }

  if (manualMode) {
    return (
      <div className="space-y-1">
        <FormInput
          label={label}
          rtl={rtl}
          value={value}
          onChange={(e) => onValueChange(e.target.value)}
          placeholder="أدخل اسم المدينة"
          error={error}
          className={className}
        />
        <Button
          type="button"
          variant="link"
          className="h-auto p-0 text-xs text-[#32A88D]"
          onClick={() => {
            setManualMode(false)
            onValueChange("")
          }}
        >
          الاختيار من القائمة بدلاً من ذلك
        </Button>
      </div>
    )
  }

  return (
    <FormSelect
      label={label}
      placeholder={placeholder ?? (cities.length ? "اختر المدينة" : "اختر الدولة أولاً")}
      rtl={rtl}
      disabled={disabled}
      value={cities.includes(value) ? value : undefined}
      onValueChange={handleSelectChange}
      options={cities.map((c) => ({ value: c, label: c }))}
      error={error}
      className={className}
    />
  )
}
