import type { AxiosInstance } from "axios";
import type { ConsultantProgramResponse } from "../types/consultant-program";
import { upsertMockConsultantProgram } from "./__mock__/consultant-programs.mock";

export const submitConsultantProgramForReview = async (
  axiosInstance: AxiosInstance,
  id: number,
): Promise<ConsultantProgramResponse> => {
  // TODO(consultant-programs-api): swap for POST /api/consultant/programs/:id/submit once the backend ships.
  const program = upsertMockConsultantProgram(id, {
    status: "pending",
    status_label: "قيد المراجعة",
    rejection_reason: null,
    can: { edit: false, delete: false, submit: false, archive: false, add_video: false },
  });

  if (!program) {
    throw new Error("Program not found");
  }

  return {
    success: true,
    message: "تم إرسال الكورس للمراجعة بنجاح",
    data: program,
    status: "success",
  };
};
