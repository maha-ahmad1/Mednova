// import axios from "axios";
// import type {
//   ApiResponse,
//   ConsultationRequest,
//   UpdateStatusParams,
// } from "@/types/consultation";

// const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

// const apiClient = axios.create({
//   baseURL: API_BASE_URL,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// export const consultationApi = {
//   // Get all consultation requests
//   // getConsultationRequests: async (): Promise<
//   //   ApiResponse<ConsultationRequest[]>
//   // > => {
//   //   const response = await apiClient.get(
//   //     "/api/consultation-request/get-status-request"
//   //   );
//   //   return response.data;
//   // },

//   // Update consultation request status
//   updateConsultationStatus: async (
//     params: UpdateStatusParams,
//     token?: string
//   ): Promise<ApiResponse<unknown>> => {
//     const response = await apiClient.post(
//       "/api/consultation-request/update-status-request",
//       params,
//       {
//         headers: token ? { Authorization: `Bearer ${token}` } : undefined,
//       }
//     );
//     return response.data;
//   },
// };
