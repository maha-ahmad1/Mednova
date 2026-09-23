import type { AxiosInstance } from "axios";
import type {
  Measurement,
  MeasurementApiEnvelope,
  PaginatedMeasurementEnvelope,
  RequestMeasurementPayload,
} from "../types";

export const requestMeasurement = async (
  axios: AxiosInstance,
  type: "video" | "chat",
  consultationId: number,
  payload: RequestMeasurementPayload,
  locale: string,
): Promise<MeasurementApiEnvelope<Measurement>> => {
  const res = await axios.post<MeasurementApiEnvelope<Measurement>>(
    `/api/consultation-request/${type}/${consultationId}/measurement`,
    payload,
    { headers: { "Accept-Language": locale } },
  );
  return res.data;
};

// GET .../measurements returns every measurement ever requested for this
// consultation, not paginated — `data` is a plain array (see measurement-api.md).
export const getConsultationMeasurements = async (
  axios: AxiosInstance,
  type: "video" | "chat",
  consultationId: number,
): Promise<MeasurementApiEnvelope<Measurement[]>> => {
  const res = await axios.get<MeasurementApiEnvelope<Measurement[]>>(
    `/api/consultation-request/${type}/${consultationId}/measurements`,
  );
  return res.data;
};

// GET .../measurements for a patient across all their consultations — paginated
// (see measurement-api.md section 5): per_page defaults to 15, capped at 50 server-side.
export const getPatientMeasurementHistory = async (
  axios: AxiosInstance,
  patientId: number,
  params: { page?: number; per_page?: number } = {},
): Promise<PaginatedMeasurementEnvelope<Measurement[]>> => {
  const res = await axios.get<PaginatedMeasurementEnvelope<Measurement[]>>(
    `/api/patients/${patientId}/measurements`,
    { params },
  );
  return res.data;
};

export const cancelMeasurement = async (
  axios: AxiosInstance,
  type: "video" | "chat",
  consultationId: number,
  measurementId: string,
): Promise<MeasurementApiEnvelope<Measurement>> => {
  const res = await axios.post<MeasurementApiEnvelope<Measurement>>(
    `/api/consultation-request/${type}/${consultationId}/measurement/${measurementId}/cancel`,
  );
  return res.data;
};
