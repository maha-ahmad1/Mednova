import { create } from "zustand"
import { persist } from "zustand/middleware"

export type TherapistDraftFormData = {
  full_name: string
  email: string
  phone: string
  birth_date: string
  gender?: "male" | "female"
  formatted_address: string
  medical_specialties_id: string
  university_name: string
  graduation_year: string
  countries_certified: string
  experience_years: string
  license_number: string
  license_authority: string
  certificate_file: File | null
  license_file: File | null
  bio: string
  image?: File
  country: string
  city: string
  day_of_week: string[]
  start_time_morning: string
  end_time_morning: string
  is_have_evening_time: 0 | 1
  start_time_evening: string
  end_time_evening: string
  video_consultation_price: string
  chat_consultation_price: string
  currency: string
  timezone: string
}

type TherapistDraftState = {
  currentStep: number
  globalErrors: Record<string, string>
  formData: TherapistDraftFormData
  setCurrentStep: (step: number) => void
  setGlobalErrors: (errors: Record<string, string>) => void
  updateFormData: (data: Partial<TherapistDraftFormData>) => void
  resetDraft: () => void
}

const initialState: Pick<TherapistDraftState, "currentStep" | "globalErrors" | "formData"> = {
  currentStep: 1,
  globalErrors: {},
  formData: {
    full_name: "",
    email: "",
    phone: "",
    birth_date: "",
    gender: undefined,
    formatted_address: "",
    medical_specialties_id: "",
    university_name: "",
    graduation_year: "",
    countries_certified: "",
    experience_years: "",
    license_number: "",
    license_authority: "",
    certificate_file: null,
    license_file: null,
    bio: "",
    image: undefined,
    country: "",
    city: "",
    day_of_week: [],
    start_time_morning: "",
    end_time_morning: "",
    is_have_evening_time: 0,
    start_time_evening: "",
    end_time_evening: "",
    video_consultation_price: "",
    chat_consultation_price: "",
    currency: "",
    timezone: "",
  },
}

export const useTherapistDraftStore = create<TherapistDraftState>()(
  persist(
    (set) => ({
      ...initialState,
      setCurrentStep: (step) => set({ currentStep: step }),
      setGlobalErrors: (errors) => set({ globalErrors: errors }),
      updateFormData: (data) => set((state) => ({ formData: { ...state.formData, ...data } })),
      resetDraft: () => set(initialState),
    }),
    { name: "therapist-create-draft" }
  )
)
