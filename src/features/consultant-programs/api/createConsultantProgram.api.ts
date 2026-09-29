import type { AxiosInstance } from "axios";
import type {
  ConsultantProgramFormPayload,
  ConsultantProgramResponse,
} from "../types/consultant-program";
import {
  insertMockConsultantProgram,
  nextMockProgramId,
} from "./__mock__/consultant-programs.mock";

export const createConsultantProgram = async (
  axiosInstance: AxiosInstance,
  payload: ConsultantProgramFormPayload,
): Promise<ConsultantProgramResponse> => {
  // TODO(consultant-programs-api): swap for POST /api/consultant/programs (multipart) once the backend ships.
  const program = insertMockConsultantProgram({
    id: nextMockProgramId(),
    title_ar: payload.title_ar,
    title_en: payload.title_en,
    description_ar: payload.description_ar,
    description_en: payload.description_en,
    what_you_will_learn_ar: payload.what_you_will_learn_ar,
    what_you_will_learn_en: payload.what_you_will_learn_en,
    cover_image: payload.cover_image ? URL.createObjectURL(payload.cover_image) : null,
    price: payload.price.toFixed(3),
    status: "draft",
    status_label: "مسودة",
    rejection_reason: null,
    platform_commission_rate: "10.00",
    your_earning_per_sale: (payload.price * 0.9).toFixed(3),
    sales_count: 0,
    can: { edit: true, delete: true, submit: false, archive: false, add_video: true },
    videos: [],
  });

  return {
    success: true,
    message: "تم إنشاء الكورس بنجاح",
    data: program,
    status: "success",
  };
};
