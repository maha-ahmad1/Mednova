export type ConsultationType = "video" | "chat"
export type ConsultationStatus = "active" | "accepted" | "cancelled" | "completed" | "pending"
export type UserType = "therapist" | "rehabilitation_center" | "patient" | "consultable"
export type ConsultantType = "therapist" | "center"

export type User = {
  id: number
  full_name: string
  email: string
  phone: string
  image?: string
  type_account: UserType
  birth_date?: string
  gender?: string
  average_rating: number | null
  total_reviews: number | null
  status: string
}

export type ConsultationData = {
  id: number
  patient: User
  consultant: User
  consultant_type: ConsultantType
  status: ConsultationStatus
  max_messages_for_patient: number | null
  patient_message_count: number
  consultant_message_count: number
  first_patient_message_at: string | null
  first_consultant_reply_at: string | null
  started_at: string | null
  ended_at: string | null
  appointment?: {
    requested_day: string
    requested_time: string
    confirmed_end_time: string
    status: string
  }
}

export type ConsultationRequest = {
  id: number
  type: ConsultationType
  status: ConsultationStatus
  created_at: string
  updated_at: string
  data: ConsultationData
  video_room_link?: string
  consultant_approved?: boolean | null
  patient_approved?: boolean | null
  appointment?: {
    requested_day: string
    requested_time: string
    confirmed_end_time: string
    status: string
  }
}

// API Request/Response types
export type UpdateStatusParams = {
  id: number
  status: ConsultationStatus 
  action_by: UserType
  action_reason?: string
  consultant_nature: ConsultationType
}

export type ApiResponse<T> = {
  success: boolean
  message: string
  data: T
  status: string
}


