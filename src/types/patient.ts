export interface PatientFormValues {
  customer_id: string
  gender: "Male" | "Female"
  birth_date?: string
  address?: string
  image?: File | null
  emergency_phone?: string
  relationship?: string
  formatted_address?: string
  country?: string
  city?: string
  status?: string
}


export interface AxiosErrorResponse {
  message?: string
  data?: Record<string, string[]>
}



export interface LocationDetails {
  id?: number
  latitude?: string | null
  longitude?: string | null
  formatted_address?: string
  country?: string
  region?: string | null
  city?: string
  district?: string | null
  postal_code?: string | null
  location_type?: string | null
}

export interface PatientDetails {
  id?: number
  emergency_phone?: string
  relationship?: string
}

export interface PatientProfile {
  id?: number
  image?: string
  full_name?: string
  email?: string
  phone?: string
  type_account?: string
  birth_date?: string
  gender?: string
  patient_details?: PatientDetails
  location_details?: LocationDetails
  // therapist_details?: any
  // center_details?: any
  // medicalSpecialties?: any[]
  // schedules?: any[]
  average_rating?: number | null
  total_reviews?: number | null

  // Legacy fields for backward compatibility
  address?: string
  emergency_contact?: string
  profile_image?: string | File
  userId?: string
  customer_id?: string
}
