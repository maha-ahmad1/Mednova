"use client";

import * as React from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { FormInput, type FormInputProps } from "./FormInput";
import { ARAB_COUNTRY_CODES, DEFAULT_COUNTRY_CODES } from "@/utils/phone";

export interface CountryCode {
  code: string;
  label?: string;
  flag?: string;
}

export interface FormPhoneInputProps extends Omit<FormInputProps, "type"> {
  countryCodes?: CountryCode[];
  defaultCountryCode?: string;
  onCountryCodeChange?: (code: string) => void;
  countryCodeValue?: string;
  /**
   * Lays the code and the number out left-to-right whatever the page direction, so the dial
   * code always sits at the visual start of the number. The caller renders the error text.
   */
  ltrNumber?: boolean;
}

const defaultCountryCodes: CountryCode[] = ARAB_COUNTRY_CODES.map(
  ({ code, label, flag }) => ({
    code,
    label: `${flag} ${label} (${code})`,
    flag,
  }),
);

const FormPhoneInput = React.forwardRef<HTMLInputElement, FormPhoneInputProps>(
  (
    {
      label,
      countryCodes = defaultCountryCodes,
      defaultCountryCode = DEFAULT_COUNTRY_CODES[0],
      onCountryCodeChange,
      countryCodeValue,
      ltrNumber = false,
      rtl = false,
      containerClassName,
      ...inputProps
    },
    ref,
  ) => {
    const [internalCountryCode, setInternalCountryCode] =
      React.useState(defaultCountryCode);
    const currentCountryCode = countryCodeValue ?? internalCountryCode;
    const selectedCountry = countryCodes.find((country) => country.code === currentCountryCode);

    const handleCountryCodeChange = (code: string) => {
      setInternalCountryCode(code);
      onCountryCodeChange?.(code);
    };

    // ✅ تزامن مع القيمة القادمة من الـ parent
    React.useEffect(() => {
      if (countryCodeValue) {
        setInternalCountryCode(countryCodeValue);
      }
    }, [countryCodeValue]);

    return (
      <div
        className={cn("space-y-2", containerClassName)}
        dir={rtl ? "rtl" : "ltr"}
      >
        {label && (
          <Label
            dir="rtl"
            htmlFor={inputProps.id}
            className={cn("block", rtl && "text-right")}
          >
            {label}
          </Label>
        )}
        <div className="flex gap-2" dir={ltrNumber ? "ltr" : undefined}>
          <div translate="no" className="notranslate">
            <Select
              value={currentCountryCode}
              onValueChange={handleCountryCodeChange}
            >
              {/* The trigger only shows flag + dial code and sizes to it: a fixed width clipped "+968". */}
              <SelectTrigger className="min-w-28 w-auto shrink-0 py-6 whitespace-nowrap">
                <SelectValue>
                  <bdi dir="ltr">
                    {selectedCountry?.flag ? `${selectedCountry.flag} ` : ""}
                    {currentCountryCode}
                  </bdi>
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="max-h-[220px] overflow-y-auto">
                {countryCodes.map((country: CountryCode) => (
                  <SelectItem key={country.code} value={country.code}>
                    {ltrNumber ? (
                      <bdi dir="ltr">{country.label || country.code}</bdi>
                    ) : (
                      country.label || country.code
                    )}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <FormInput
            ref={ref}
            type="tel"
            className="no-spinner "
            containerClassName="flex-1"
            rtl={ltrNumber ? false : rtl}
            {...inputProps}
          />
        </div>
      </div>
    );
  },
);

FormPhoneInput.displayName = "FormPhoneInput";

export { FormPhoneInput };
