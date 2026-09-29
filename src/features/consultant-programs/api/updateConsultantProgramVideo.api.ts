import type { AxiosInstance } from "axios";
import type {
  ConsultantProgramResponse,
  ConsultantProgramVideoPayload,
} from "../types/consultant-program";
import {
  getMockConsultantProgramById,
  upsertMockConsultantProgram,
} from "./__mock__/consultant-programs.mock";

interface UpdateConsultantProgramVideoArgs {
  programId: number;
  videoId: number;
  payload: Omit<ConsultantProgramVideoPayload, "video"> & { video?: File };
}

export const updateConsultantProgramVideo = async (
  axiosInstance: AxiosInstance,
  { programId, videoId, payload }: UpdateConsultantProgramVideoArgs,
): Promise<ConsultantProgramResponse> => {
  // TODO(consultant-programs-api): swap for POST /api/consultant/programs/videos/:id (+ _method=PUT, multipart).
  const current = getMockConsultantProgramById(programId);
  if (!current) {
    throw new Error("Program not found");
  }

  const program = upsertMockConsultantProgram(programId, {
    videos: current.videos.map((video) =>
      video.id === videoId
        ? {
            ...video,
            title_ar: payload.title_ar,
            title_en: payload.title_en,
            order: payload.order,
            is_program_intro: payload.is_program_intro,
            is_free: payload.is_free,
          }
        : video,
    ),
  });

  if (!program) {
    throw new Error("Program not found");
  }

  return {
    success: true,
    message: "تم تحديث الفيديو بنجاح",
    data: program,
    status: "success",
  };
};
