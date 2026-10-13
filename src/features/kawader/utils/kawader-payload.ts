import type { CreateKawaderRequestPayload, KawaderService, KawaderServiceKey } from "../types/kawader";
import type { KawaderRequestFormValues } from "../types/kawader-form";
import { getUserTimezone, toApiLocalDateTime } from "./kawader-datetime";
import { buildKawaderPhone, normalizeDigits } from "./kawader-phone";

interface PayloadContext {
  service?: KawaderService | null;
  areasEnabled: boolean;
  insuranceEnabled: boolean;
}

/** Form values to the P2 body. Conditional fields are sent only when their rule applies. */
export function buildCreatePayload(
  values: KawaderRequestFormValues,
  { service, areasEnabled, insuranceEnabled }: PayloadContext,
): CreateKawaderRequestPayload {
  const payload: CreateKawaderRequestPayload = {
    service_key: values.service_key as KawaderServiceKey,
    patient_name: values.patient_name.trim(),
    patient_age: Number(normalizeDigits(values.patient_age).trim()),
    patient_phone: buildKawaderPhone(values.phone_country_code, values.phone_number),
    location_address: values.location_address.trim(),
    preferred_at: toApiLocalDateTime(new Date(`${values.preferred_date}T${values.preferred_time}`)),
    timezone: getUserTimezone(),
    consent: true,
  };

  if (areasEnabled && values.service_area) payload.service_area = values.service_area;

  const latitude = Number(values.latitude);
  const longitude = Number(values.longitude);
  if (values.latitude && values.longitude && Number.isFinite(latitude) && Number.isFinite(longitude)) {
    payload.latitude = latitude;
    payload.longitude = longitude;
  }

  if (service?.needs_destination) payload.transfer_destination = values.transfer_destination.trim();

  const notes = values.patient_notes.trim();
  if (notes) payload.patient_notes = notes;

  if (insuranceEnabled) {
    payload.has_insurance = values.has_insurance;
    if (values.has_insurance) {
      payload.insurance_company = values.insurance_company.trim();
      payload.insurance_card_number = values.insurance_card_number.trim();
    }
  }

  return payload;
}
