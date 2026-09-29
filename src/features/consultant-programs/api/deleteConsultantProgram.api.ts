import type { AxiosInstance } from "axios";
import { removeMockConsultantProgram } from "./__mock__/consultant-programs.mock";

export const deleteConsultantProgram = async (
  axiosInstance: AxiosInstance,
  id: number,
): Promise<{ success: boolean; message: string; status: string }> => {
  // TODO(consultant-programs-api): swap for DELETE /api/consultant/programs/:id once the backend ships.
  removeMockConsultantProgram(id);

  return { success: true, message: "تم حذف الكورس بنجاح", status: "success" };
};
