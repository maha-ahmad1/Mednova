export const PHONE_DIGIT_LENGTH: Record<string, number[]> = {
  "+968": [8],
  "+966": [9],
  "+971": [9],
  "+965": [8],
  "+974": [8],
  "+973": [8],
  "+967": [9],
  "+962": [9],
  "+961": [7, 8], // Lebanon: legacy mobile prefix "3" = 7 digits,
  // newer prefixes (70/71/76/78/79/81) and landlines = 8 digits.
  // Backend rule currently hardcodes 9 for +961 — this is
  // wrong per Lebanon's actual numbering plan and needs a
  // backend fix; frontend should NOT mirror the incorrect 9.
  "+963": [9],
  "+964": [10],
  "+970": [9],
  "+20": [10],
  "+218": [9],
  "+216": [8],
  "+213": [9],
  "+212": [9],
  "+249": [9],
};

export function isValidPhoneLength(countryCode: string, nationalNumber: string): boolean {
  const validLengths = PHONE_DIGIT_LENGTH[countryCode];
  if (!validLengths) return false;
  return validLengths.includes(nationalNumber.length);
}

export function phoneLengthErrorMessage(countryCode: string): string {
  const validLengths = PHONE_DIGIT_LENGTH[countryCode];
  if (!validLengths) return "كود الدولة غير مدعوم";
  return validLengths.length === 1
    ? `رقم الهاتف يجب أن يتكون من ${validLengths[0]} أرقام لهذه الدولة`
    : `رقم الهاتف يجب أن يتكون من ${validLengths.join(" أو ")} أرقام لهذه الدولة`;
}
