import type { AxiosInstance } from "axios";
import type { ConsultationDetailsResponse } from "../types";

/**
 * Fetches consultation details. The URL segment 'consultant' is a backend naming quirk —
 * the actual data shape returned depends on the auth token (patient or consultant). This
 * function is used by the patient-facing /payment page; the returned ConsultationFinancial
 * reflects the patient shape.
 */
export const getConsultationDetails = async (
  axios: AxiosInstance,
  id: string | number,
  type: "video" | "chat",
): Promise<ConsultationDetailsResponse> => {
  const res = await axios.get<ConsultationDetailsResponse>(
    `/api/consultation-request/consultant/${id}/${type}`,
  );
  return res.data;
};

