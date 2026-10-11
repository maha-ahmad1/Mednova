import type { AxiosInstance } from "axios";
import type {
  ConsultantProgramFormPayload,
  ConsultantProgramResponse,
} from "../types/consultant-program";
import { buildConsultantProgramFormData, multipartConfig } from "./buildConsultantProgramFormData";

export const createConsultantProgram = async (
  axiosInstance: AxiosInstance,
  payload: ConsultantProgramFormPayload,
): Promise<ConsultantProgramResponse> => {
  const formData = buildConsultantProgramFormData(payload);

  const response = await axiosInstance.post<ConsultantProgramResponse>(
    "/api/consultant/programs",
    formData,
    multipartConfig,
  );

  return response.data;
};
