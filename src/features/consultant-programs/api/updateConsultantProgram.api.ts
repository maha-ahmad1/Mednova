import type { AxiosInstance } from "axios";
import type {
  ConsultantProgramFormPayload,
  ConsultantProgramResponse,
} from "../types/consultant-program";
import { buildConsultantProgramFormData, multipartConfig } from "./buildConsultantProgramFormData";

export const updateConsultantProgram = async (
  axiosInstance: AxiosInstance,
  id: number,
  payload: ConsultantProgramFormPayload,
): Promise<ConsultantProgramResponse> => {
  const formData = buildConsultantProgramFormData(payload);
  // Laravel method-spoofing — multipart bodies must be sent as POST.
  formData.append("_method", "PUT");

  const response = await axiosInstance.post<ConsultantProgramResponse>(
    `/api/consultant/programs/${id}`,
    formData,
    multipartConfig,
  );

  return response.data;
};
