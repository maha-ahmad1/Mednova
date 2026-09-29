import type { AxiosInstance } from "axios";
import type {
  ConsultantProgramResponse,
  ConsultantProgramVideoPayload,
} from "../types/consultant-program";
import {
  getMockConsultantProgramById,
  nextMockVideoId,
  upsertMockConsultantProgram,
} from "./__mock__/consultant-programs.mock";

interface AddConsultantProgramVideoArgs {
  programId: number;
  payload: ConsultantProgramVideoPayload;
  onUploadProgress?: (event: { loaded: number; total: number }) => void;
}

const UPLOAD_TOTAL_BYTES = 10_000_000;
const UPLOAD_STEP_MS = 300;

// Simulates a real chunked upload so the progress bar actually moves during
// this mock stage, instead of jumping straight to 100%.
const simulateUpload = (
  onUploadProgress?: (event: { loaded: number; total: number }) =>
    void,
) =>
  new Promise<void>((resolve) => {
    let loaded = 0;

    const interval = setInterval(() => {
      loaded = Math.min(UPLOAD_TOTAL_BYTES, loaded + UPLOAD_TOTAL_BYTES * 0.1);
      onUploadProgress?.({ loaded, total: UPLOAD_TOTAL_BYTES });

      if (loaded >= UPLOAD_TOTAL_BYTES) {
        clearInterval(interval);
        setTimeout(resolve, 400);
      }
    }, UPLOAD_STEP_MS);
  });

export const addConsultantProgramVideo = async (
  axiosInstance: AxiosInstance,
  { programId, payload, onUploadProgress }: AddConsultantProgramVideoArgs,
): Promise<ConsultantProgramResponse> => {
  // TODO(consultant-programs-api): swap for POST /api/consultant/programs/:id/videos (multipart) once the backend ships.
  await simulateUpload(onUploadProgress);

  const current = getMockConsultantProgramById(programId);
  if (!current) {
    throw new Error("Program not found");
  }

  const program = upsertMockConsultantProgram(programId, {
    videos: [
      ...current.videos,
      {
        id: nextMockVideoId(),
        title_ar: payload.title_ar,
        title_en: payload.title_en,
        order: payload.order,
        is_program_intro: payload.is_program_intro,
        is_free: payload.is_free,
        review_status: "pending",
        rejection_reason: null,
      },
    ],
  });

  if (!program) {
    throw new Error("Program not found");
  }

  return {
    success: true,
    message: "تمت إضافة الفيديو بنجاح",
    data: program,
    status: "success",
  };
};
