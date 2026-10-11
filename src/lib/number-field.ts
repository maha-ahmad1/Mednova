import type { ChangeEvent } from "react"

/** Empty/invalid input maps to 0 instead of being coerced by Number("") on every keystroke. */
export function createNumberFieldHandler(onChange: (value: number) => void) {
  return (event: ChangeEvent<HTMLInputElement>) => {
    const raw = event.target.value
    const parsed = Number(raw)
    onChange(raw === "" || Number.isNaN(parsed) ? 0 : parsed)
  }
}

/** Show an empty input while the value is 0 so the user can type a new number right away. */
export const numberFieldValue = (value: number) => (value === 0 ? "" : value)
