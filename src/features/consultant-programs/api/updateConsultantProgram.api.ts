import type { AxiosInstance } from "axios";
import type {
  ConsultantProgramFormPayload,
  ConsultantProgramResponse,
} from "../types/consultant-program";
import { upsertMockConsultantProgram } from "./__mock__/consultant-programs.mock";

export const updateConsultantProgram = async (
  axiosInstance: AxiosInstance,
  id: number,
  payload: ConsultantProgramFormPayload,
): Promise<ConsultantProgramResponse> => {
  // TODO(consultant-programs-api): swap for POST /api/consultant/programs/:id (+ _method=PUT, multipart).
  const program = upsertMockConsultantProgram(id, {
    title_ar: payload.title_ar,
    title_en: payload.title_en,
    description_ar: payload.description_ar,
    description_en: payload.description_en,
    what_you_will_learn_ar: payload.what_you_will_learn_ar,
    what_you_will_learn_en: payload.what_you_will_learn_en,
    price: payload.price.toFixed(3),
    ...(payload.cover_image
      ? { cover_image: URL.createObjectURL(payload.cover_image) }
      : {}),
  });

  if (!program) {
    throw new Error("Program not found");
  }

  return {
    success: true,
    message: "تم تحديث الكورس بنجاح",
    data: program,
    status: "success",
  };
};
