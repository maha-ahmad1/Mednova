"use client"

import * as React from "react"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { FormInput, type FormInputProps } from "./FormInput"
import { DEFAULT_COUNTRY_CODES } from "@/lib/phone"

export interface CountryCode {
  code: string
  label?: string
}

export interface FormPhoneInputProps extends Omit<FormInputProps, "type"> {
  countryCodes?: CountryCode[]
  defaultCountryCode?: string
  onCountryCodeChange?: (code: string) => void
  countryCodeValue?: string
}

const defaultCountryCodes: CountryCode[] = DEFAULT_COUNTRY_CODES.map((code) => ({ code }))

const FormPhoneInput = React.forwardRef<HTMLInputElement, FormPhoneInputProps>(
  (
    {
      label,
      countryCodes = defaultCountryCodes,
      defaultCountryCode = "+968",
      onCountryCodeChange,
      countryCodeValue,
      rtl = false,
      containerClassName,
      ...inputProps
    },
    ref,
  ) => {
    const [internalCountryCode, setInternalCountryCode] = React.useState(defaultCountryCode)
    const currentCountryCode = countryCodeValue ?? internalCountryCode

    const handleCountryCodeChange = (code: string) => {
      setInternalCountryCode(code)
      onCountryCodeChange?.(code)
    }

    // ✅ تزامن مع القيمة القادمة من الـ parent
    React.useEffect(() => {
      if (countryCodeValue) {
        setInternalCountryCode(countryCodeValue)
      }
    }, [countryCodeValue])

    return (
      <div className={cn("space-y-2", containerClassName)} dir={rtl ? "rtl" : "ltr"}>
        {label && (
          <Label htmlFor={inputProps.id} className={cn("block", rtl && "text-right")}>
            {label}
          </Label>
        )}
        <div className="flex gap-2">
          <Select value={currentCountryCode} onValueChange={handleCountryCodeChange}>
            <SelectTrigger className="w-24 py-6">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {countryCodes.map((country: CountryCode) => (
                <SelectItem key={country.code} value={country.code}>
                  {country.label || country.code}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormInput
            ref={ref}
            type="tel"
            inputMode="tel"
            className="no-spinner"
            containerClassName="flex-1"
            rtl={rtl}
            {...inputProps}
          />
        </div>
      </div>
    )
  },
)

FormPhoneInput.displayName = "FormPhoneInput"

export { FormPhoneInput }
