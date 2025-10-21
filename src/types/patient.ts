export interface PatientFormValues {
  customer_id: string
  gender: "Male" | "Female"
  birth_date?: string
  address: string
  image?: File | null
  emergency_phone?: string
  relationship?: string
}


export interface AxiosErrorResponse {
  message?: string
  data?: Record<string, string[]>
}
