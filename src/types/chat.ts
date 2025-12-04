export interface User {
  id: number;
  name: string;
  email?: string;
  image?: string;
}

export interface Message {
  id: number;
  sender_id: number | User;
  receiver_id: number | User;
  chat_request_id: number;
  message: string;
  attachment: string | null;
  attachment_type: string | null;
  is_read: boolean;
  read_at: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  sender?: {
    id: number;
    full_name: string;
    image?: string;
    type_account: string;
  };
  receiver?: {
    id: number;
    full_name: string;
    image?: string;
    type_account: string;
  };
}

export interface ChatRequest {
  id: number;
  patient_id: number;
  consultant_id: number;
  consultant_type: string;
  status: string;
  first_patient_message_at: string | null;
  first_consultant_message_at: string | null;
  patient_message_count: number;
  consultant_message_count: number;
  max_messages_for_patient: number | null;
  created_at: string;
  updated_at: string;
  consultant_full_name: string;
  patient_full_name: string;
  patient_image?: string | undefined;
  consultant_image?: string | undefined;
}

export interface SendMessageData {
  receiver_id: number;
  message: string;
  chat_request_id: number;
  // Optional attachment support for uploading files/images
  attachment?: File | null;
  attachment_type?: "image" | "file" | "voice" | null;
}

export interface UpdateChatData {
  chat_request_id: number;
  first_patient_message_at?: string;
  first_consultant_message_at?: string;
  patient_message_count?: number;
  consultant_message_count?: number;
}

export interface PusherMessageEvent {
  message: {
    id: number;
    sender_id: number;
    receiver_id: number;
    chat_request_id: number;
    message: string;
    attachment: string | null;
    attachment_type: string | null;
    is_read: number;
    read_at: string | null;
    status: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
  };
}
