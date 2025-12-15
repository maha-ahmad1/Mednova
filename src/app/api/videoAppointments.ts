// // app/api/video-appointments/index.ts
// import axios from "axios";

// const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

// const apiClient = axios.create({
//   baseURL: API_BASE_URL,
//   headers: { "Content-Type": "application/json" },
// });

// export interface BookVideoAppointmentPayload {
//   patient_id: number | string;
//   consultant_id: number | string;
//   consultant_type: string;
//   consultant_nature: "video";
//   requested_day: string;
//   requested_time: string;
//   type_appointment: "online";
// }

// export interface BookVideoAppointmentResponse {
//   success: boolean;
//   message: string;
//   data: any;
//   status: string;
// }

// export const videoAppointmentsApi = {
//   bookAppointment: async (
//     payload: BookVideoAppointmentPayload,
//     token?: string
//   ): Promise<BookVideoAppointmentResponse> => {
//     const headers: Record<string, string> = {
//       "Content-Type": "application/json",
//     };
    
//     if (token) {
//       headers["Authorization"] = `Bearer ${token}`;
//     }
    
//     const response = await apiClient.post(
//       "/api/consultation-request/store",
//       payload,
//       { headers }
//     );
    
//     return response.data;
//   },
// };