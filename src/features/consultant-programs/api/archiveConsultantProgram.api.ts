import type { AxiosInstance } from "axios";
import type { ConsultantProgramResponse } from "../types/consultant-program";
import { upsertMockConsultantProgram } from "./__mock__/consultant-programs.mock";

export const archiveConsultantProgram = async (
  axiosInstance: AxiosInstance,
  id: number,
): Promise<ConsultantProgramResponse> => {
  // TODO(consultant-programs-api): swap for POST /api/consultant/programs/:id/archive once the backend ships.
  const program = upsertMockConsultantProgram(id, {
    status: "archived",
    status_label: "مؤرشف",
    can: { edit: false, delete: false, submit: false, archive: false, add_video: false },
  });

  if (!program) {
    throw new Error("Program not found");
  }

  return {
    success: true,
    message: "تمت أرشفة الكورس بنجاح",
    data: program,
    status: "success",
  };
};
