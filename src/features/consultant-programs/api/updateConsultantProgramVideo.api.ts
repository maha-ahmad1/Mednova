import type { AxiosInstance } from "axios";
import type {
  ConsultantProgramResponse,
  ConsultantProgramVideoPayload,
} from "../types/consultant-program";

interface UpdateConsultantProgramVideoArgs {
  programId: number;
  videoId: number;
  payload: Omit<ConsultantProgramVideoPayload, "video"> & { video?: File };
}

export const updateConsultantProgramVideo = async (
  axiosInstance: AxiosInstance,
  { programId, videoId, payload }: UpdateConsultantProgramVideoArgs,
): Promise<ConsultantProgramResponse> => {
  const formData = new FormData();
  formData.append("title_ar", payload.title_ar);
  formData.append("title_en", payload.title_en);
  formData.append("order", String(payload.order));
  formData.append("duration_minute", String(payload.duration_minute));
  formData.append("is_program_intro", payload.is_program_intro ? "1" : "0");
  formData.append("is_free", payload.is_free ? "1" : "0");

  if (payload.video instanceof File) {
    formData.append("video", payload.video);
  }

  // Laravel method-spoofing — multipart bodies must be sent as POST.
  formData.append("_method", "PUT");

  const response = await axiosInstance.post<ConsultantProgramResponse>(
    `/api/consultant/programs/${programId}/videos/${videoId}`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } },
  );

  return response.data;
};
