import type { AxiosInstance } from "axios";
import type {
  ConsultantProgramResponse,
  ConsultantProgramVideoPayload,
} from "../types/consultant-program";

interface AddConsultantProgramVideoArgs {
  programId: number;
  payload: ConsultantProgramVideoPayload;
  onUploadProgress?: (event: { loaded: number; total: number }) => void;
}

export const addConsultantProgramVideo = async (
  axiosInstance: AxiosInstance,
  { programId, payload, onUploadProgress }: AddConsultantProgramVideoArgs,
): Promise<ConsultantProgramResponse> => {
  const formData = new FormData();
  formData.append("title_ar", payload.title_ar);
  formData.append("title_en", payload.title_en);
  formData.append("order", String(payload.order));
  formData.append("duration_minute", String(payload.duration_minute));
  formData.append("is_program_intro", payload.is_program_intro ? "1" : "0");
  formData.append("is_free", payload.is_free ? "1" : "0");
  formData.append("video", payload.video);

  const response = await axiosInstance.post<ConsultantProgramResponse>(
    `/api/consultant/programs/${programId}/videos`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: (progressEvent) => {
        if (!onUploadProgress || !progressEvent.total) return;
        onUploadProgress({ loaded: progressEvent.loaded, total: progressEvent.total });
      },
    },
  );

  return response.data;
};
