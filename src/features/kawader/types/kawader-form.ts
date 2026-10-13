import { z } from "zod";
import type { KawaderService } from "./kawader";
import { MAX_DAYS_AHEAD, MIN_HOURS_BEFORE } from "../utils/kawader-constants";
import {
  PHONE_MAX_DIGITS,
  PHONE_MIN_DIGITS,
  buildKawaderPhone,
  hasEmbeddedCountryCode,
  normalizeDigits,
} from "../utils/kawader-phone";

// Everything is a string (inputs are text) except the two checkboxes. Conversion to the
// API payload types happens in `buildCreatePayload`.
export interface KawaderRequestFormValues {
  service_key: string;
  service_area: string;
  patient_name: string;
  patient_age: string;
  phone_country_code: string;
  phone_number: string;
  location_address: string;
  /** Hidden: filled by "use my current location". */
  latitude: string;
  longitude: string;
  transfer_destination: string;
  /** "YYYY-MM-DD" and "HH:mm", in the patient's local time. */
  preferred_date: string;
  preferred_time: string;
  patient_notes: string;
  has_insurance: boolean;
  insurance_company: string;
  insurance_card_number: string;
  consent: boolean;
}

export type KawaderT = (key: string, values?: Record<string, string | number>) => string;

interface KawaderSchemaContext {
  /** The selected service; its `needs_details` / `needs_destination` flags drive the rules. */
  service?: KawaderService | null;
  /** True only when the API returned a non-empty `areas` list. */
  areasEnabled: boolean;
  insuranceEnabled: boolean;
}

const baseSchema = z.object({
  service_key: z.string(),
  service_area: z.string(),
  patient_name: z.string(),
  patient_age: z.string(),
  phone_country_code: z.string(),
  phone_number: z.string(),
  location_address: z.string(),
  latitude: z.string(),
  longitude: z.string(),
  transfer_destination: z.string(),
  preferred_date: z.string(),
  preferred_time: z.string(),
  patient_notes: z.string(),
  has_insurance: z.boolean(),
  insurance_company: z.string(),
  insurance_card_number: z.string(),
  consent: z.boolean(),
});

const NAME_MIN = 3;
const NAME_MAX = 150;
const AGE_MIN = 0;
const AGE_MAX = 120;
const TEXT_MIN = 5;
const TEXT_MAX = 500;
const NOTES_MIN = 5;
const NOTES_MAX = 1000;

// Rebuild with `useMemo` when the selected service changes: its flags change the rules.
export function createKawaderRequestSchema(t: KawaderT, context: KawaderSchemaContext) {
  const { service, areasEnabled, insuranceEnabled } = context;

  return baseSchema.superRefine((values, ctx) => {
    const fail = (path: keyof KawaderRequestFormValues, message: string) =>
      ctx.addIssue({ code: "custom", path: [path], message });

    const checkLength = (
      path: keyof KawaderRequestFormValues,
      value: string,
      min: number,
      max: number,
    ) => {
      const length = value.trim().length;
      if (length === 0) return fail(path, t("validation.required"));
      if (length < min || length > max) return fail(path, t("validation.lengthRange", { min, max }));
    };

    if (!values.service_key) fail("service_key", t("validation.serviceRequired"));

    if (areasEnabled && !values.service_area) fail("service_area", t("validation.areaRequired"));

    checkLength("patient_name", values.patient_name, NAME_MIN, NAME_MAX);

    const age = normalizeDigits(values.patient_age).trim();
    if (!age) {
      fail("patient_age", t("validation.required"));
    } else if (!/^\d{1,3}$/.test(age) || Number(age) < AGE_MIN || Number(age) > AGE_MAX) {
      fail("patient_age", t("validation.ageRange", { min: AGE_MIN, max: AGE_MAX }));
    }

    if (!values.phone_number.trim()) {
      fail("phone_number", t("validation.required"));
    } else if (hasEmbeddedCountryCode(values.phone_number)) {
      fail("phone_number", t("validation.phoneNoCode"));
    } else {
      const combined = buildKawaderPhone(values.phone_country_code, values.phone_number);
      const digits = combined.length - 1; // minus the leading "+"
      if (digits < PHONE_MIN_DIGITS || digits > PHONE_MAX_DIGITS) {
        fail("phone_number", t("validation.phoneInvalid", { min: PHONE_MIN_DIGITS, max: PHONE_MAX_DIGITS }));
      }
    }

    checkLength("location_address", values.location_address, TEXT_MIN, TEXT_MAX);

    // Coordinates are sent together or not at all.
    const hasLat = values.latitude.trim() !== "";
    const hasLng = values.longitude.trim() !== "";
    if (hasLat !== hasLng) fail("location_address", t("validation.locationIncomplete"));

    if (service?.needs_destination) {
      checkLength("transfer_destination", values.transfer_destination, TEXT_MIN, TEXT_MAX);
    }

    if (!values.preferred_date) fail("preferred_date", t("validation.required"));
    if (!values.preferred_time) fail("preferred_time", t("validation.required"));
    if (values.preferred_date && values.preferred_time) {
      // No offset in the string, so it is parsed as the patient's local time.
      const preferred = new Date(`${values.preferred_date}T${values.preferred_time}`).getTime();
      const now = Date.now();
      if (Number.isNaN(preferred)) {
        fail("preferred_date", t("validation.dateInvalid"));
      } else if (preferred < now + MIN_HOURS_BEFORE * 3_600_000) {
        fail("preferred_date", t("validation.tooSoon", { hours: MIN_HOURS_BEFORE }));
      } else if (preferred > now + MAX_DAYS_AHEAD * 86_400_000) {
        fail("preferred_date", t("validation.tooFar", { days: MAX_DAYS_AHEAD }));
      }
    }

    const notesLength = values.patient_notes.trim().length;
    if (service?.needs_details) {
      if (notesLength === 0) fail("patient_notes", t("validation.required"));
      else if (notesLength < NOTES_MIN) fail("patient_notes", t("validation.notesMin", { min: NOTES_MIN }));
    }
    if (notesLength > NOTES_MAX) fail("patient_notes", t("validation.notesMax", { max: NOTES_MAX }));

    if (insuranceEnabled && values.has_insurance) {
      if (!values.insurance_company.trim()) fail("insurance_company", t("validation.required"));
      if (!values.insurance_card_number.trim()) fail("insurance_card_number", t("validation.required"));
    }

    if (!values.consent) fail("consent", t("validation.consentRequired"));
  });
}

export const getKawaderFormDefaults = (
  patientName: string,
  countryCode: string,
): KawaderRequestFormValues => ({
  service_key: "",
  service_area: "",
  patient_name: patientName,
  patient_age: "",
  phone_country_code: countryCode,
  phone_number: "",
  location_address: "",
  latitude: "",
  longitude: "",
  transfer_destination: "",
  preferred_date: "",
  preferred_time: "",
  patient_notes: "",
  has_insurance: false,
  insurance_company: "",
  insurance_card_number: "",
  consent: false,
});
