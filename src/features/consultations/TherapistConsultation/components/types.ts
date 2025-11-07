// // types.ts
// export type ConsultationType = "video" | "chat";
// export type ConsultationStatus = "pending" | "accepted" | "rejected" | "completed" | "waiting";
// export type PriorityLevel = "low" | "medium" | "high";

// export interface Patient {
//   id: number;
//   full_name: string;
//   email: string;
//   phone: string;
//   location: string;
// }

// export interface ConsultationRequest {
//   id: number;
//   patient: Patient;
//   type: ConsultationType;
//   status: ConsultationStatus;
//   scheduled_time?: string;
//   created_at: string;
//   symptoms: string;
//   duration: number;
//   price: number;
//   priority?: PriorityLevel;
//   rejection_reason?: string;
// }

// export interface ConsultationActions {
//   onAccept: (requestId: number) => void;
//   onReject: (requestId: number, reason: string) => Promise<void>;
//   onStartConsultation: (requestId: number) => void;
//   onSelectRequest: (request: ConsultationRequest) => void;
// }