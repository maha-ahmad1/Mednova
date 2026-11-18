import type { ConsultantProgramFormPayload } from "../types/consultant-program";

const TEXT_FIELDS = [
  "title_en",
  "description_ar",
  "description_en",
  "what_you_will_learn_ar",
  "what_you_will_learn_en",
] as const;

// Shared by create/update so the multipart field names stay in one place.
// `includeEmpty`: on update an empty field is still sent so clearing it actually clears it;
// on create empty optional fields are left out (only title_ar is required there).
export const buildConsultantProgramFormData = (
  payload: ConsultantProgramFormPayload,
  { includeEmpty = false }: { includeEmpty?: boolean } = {},
): FormData => {
  const formData = new FormData();

  formData.append("title_ar", payload.title_ar);

  for (const key of TEXT_FIELDS) {
    const value = payload[key]?.trim() ?? "";
    if (value || includeEmpty) formData.append(key, value);
  }

  if (typeof payload.price === "number" && !Number.isNaN(payload.price)) {
    formData.append("price", String(payload.price));
  } else if (includeEmpty) {
    formData.append("price", "");
  }

  if (payload.cover_image instanceof File) {
    formData.append("cover_image", payload.cover_image);
  }

  return formData;
};

export const multipartConfig = {
  headers: { "Content-Type": "multipart/form-data" },
};
