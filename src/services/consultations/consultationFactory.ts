import type { ConsultationRequest } from "@/types/consultation";

export interface ConsultationEvent {
  id: number;
  patient_id: number;
  patient_name: string;
  consultant_id: number;
  consultant_name: string;
  consultant_type: string;
  message: string;
  consultation_type: "chat" | "video";
  status: "pending" | "accepted" | "cancelled" | "active" | "completed";
  video_room_link?: string;
  created_at?: string;
  updated_at?: string;
}

export const createConsultationRequest = (
  event: ConsultationEvent,
): ConsultationRequest => {
  return {
    id: event.id,
    type: event.consultation_type,
    status: event.status,
    created_at: event.created_at || new Date().toISOString(),
    updated_at: event.updated_at || new Date().toISOString(),
    video_room_link: event.video_room_link || undefined,
    data: {
      id: event.id,
      patient: {
        id: event.patient_id,
        full_name: event.patient_name,
        email: "",
        phone: "",
        type_account: "patient",
        average_rating: null,
        total_reviews: null,
        status: "active",
      },
      consultant: {
        id: event.consultant_id,
        full_name: event.consultant_name,
        email: "",
        phone: "",
        type_account: event.consultant_type as "therapist" | "rehabilitation_center",
        average_rating: null,
        total_reviews: null,
        status: "active",
      },
      consultant_type: event.consultant_type as "therapist" | "center",
      status: event.status,
      max_messages_for_patient: null,
      patient_message_count: 0,
      consultant_message_count: 0,
      first_patient_message_at: null,
      first_consultant_reply_at: null,
      started_at: null,
      ended_at: null,
    },
  };
};
