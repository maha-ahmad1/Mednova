import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

export interface CheckAvailableSlotsParams {
  consultant_id: string | number;
  consultant_type: string;
  day: string;
  date: string;
  type_appointment: string;
  patient_id?: string | number;
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
    params: CheckAvailableSlotsParams,
    token?: string
  ): Promise<AvailableSlotsResponse> => {
    console.log("Token in API call:", token);
    
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    
    const response = await apiClient.post(
      "/api/consultation-request/video/check-available-slots",
      params,
      { headers }
    );
    
    return response.data;
  },
};