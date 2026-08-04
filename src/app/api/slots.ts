import type { AxiosInstance } from "axios";

export interface CheckAvailableSlotsParams {
  consultant_id: string | number;
  consultant_type: string;
  day: string;
  date: string;
  type_appointment: string;
  patient_id?: string | number;
  timezone?: string;
}

export interface AvailableSlotsResponse {
  success: boolean;
  message: string;
  data: {
    day: string;
    available_slots: string[];
  };
  status: string;
}

export const slotsApi = {
  checkAvailableSlots: async (
    axios: AxiosInstance,
    params: CheckAvailableSlotsParams,
  ): Promise<AvailableSlotsResponse> => {
    const response = await axios.post(
      "/api/consultation-request/video/check-available-slots",
      params,
    );

    return response.data;
  },
};