import type { ConsultantProgramFormPayload } from "../types/consultant-program";

// Shared by create/update so the multipart field names stay in one place.
export const buildConsultantProgramFormData = (payload: ConsultantProgramFormPayload): FormData => {
  const formData = new FormData();

  formData.append("title_ar", payload.title_ar);
  formData.append("title_en", payload.title_en);
  formData.append("description_ar", payload.description_ar);
  formData.append("description_en", payload.description_en);
  formData.append("what_you_will_learn_ar", payload.what_you_will_learn_ar);
  formData.append("what_you_will_learn_en", payload.what_you_will_learn_en);
  formData.append("price", String(payload.price));

  if (payload.cover_image instanceof File) {
    formData.append("cover_image", payload.cover_image);
  }

  return formData;
};

export const multipartConfig = {
  headers: { "Content-Type": "multipart/form-data" },
};
