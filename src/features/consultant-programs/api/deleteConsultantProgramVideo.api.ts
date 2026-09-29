import type { AxiosInstance } from "axios";
import type { ConsultantProgramResponse } from "../types/consultant-program";
import {
  getMockConsultantProgramById,
  upsertMockConsultantProgram,
} from "./__mock__/consultant-programs.mock";

export const deleteConsultantProgramVideo = async (
  axiosInstance: AxiosInstance,
  programId: number,
  videoId: number,
): Promise<ConsultantProgramResponse> => {
  // TODO(consultant-programs-api): swap for DELETE /api/consultant/programs/videos/:id once the backend ships.
  const current = getMockConsultantProgramById(programId);
  if (!current) {
    throw new Error("Program not found");
  }

  const program = upsertMockConsultantProgram(programId, {
    videos: current.videos.filter((video) => video.id !== videoId),
  });

  if (!program) {
    throw new Error("Program not found");
  }

  return {
    success: true,
    message: "تم حذف الفيديو بنجاح",
    data: program,
    status: "success",
  };
};
