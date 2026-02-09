import { create } from "zustand"
import { persist } from "zustand/middleware"

export type CenterDraftFormData = {
  gender?: "male" | "female"
  birth_date: string
  image?: File
  specialty_id: string[]
  year_establishment: string
  has_commercial_registration: boolean
  commercial_registration_number: string
  commercial_registration_file: File | null
  commercial_registration_authority: string
  license_authority: string
  license_file: File | null
  license_number: string
  bio: string
  day_of_week: string[]
  is_have_evening_time: boolean
  status?: string
  start_time_morning: string
  end_time_morning: string
  start_time_evening: string
  end_time_evening: string
  city: string
  country: string
  formatted_address: string
  timezone: string
  video_consultation_price: string
  chat_consultation_price: string
  currency: string
  name_center: string
}

type CenterDraftState = {
  currentStep: number
  globalErrors: Record<string, string>
  formData: CenterDraftFormData
  setCurrentStep: (step: number) => void
  setGlobalErrors: (errors: Record<string, string>) => void
  updateFormData: (data: Partial<CenterDraftFormData>) => void
  resetDraft: () => void
}

const initialState: Pick<CenterDraftState, "currentStep" | "globalErrors" | "formData"> = {
  currentStep: 1,
  globalErrors: {},
  formData: {
    gender: undefined,
    birth_date: "",
    image: undefined,
    specialty_id: [],
    year_establishment: "",
    has_commercial_registration: false,
    commercial_registration_number: "",
    commercial_registration_file: null,
    commercial_registration_authority: "",
    license_authority: "",
    license_file: null,
    license_number: "",
    bio: "",
    day_of_week: [],
    is_have_evening_time: false,
    start_time_morning: "",
    end_time_morning: "",
    start_time_evening: "",
    end_time_evening: "",
    city: "",
    country: "",
    formatted_address: "",
    timezone: "",
    video_consultation_price: "",
    chat_consultation_price: "",
    currency: "",
    name_center: "",
  },
}

export const useCenterDraftStore = create<CenterDraftState>()(
  persist(
    (set) => ({
      ...initialState,
      setCurrentStep: (step) => set({ currentStep: step }),
      setGlobalErrors: (errors) => set({ globalErrors: errors }),
      updateFormData: (data) => set((state) => ({ formData: { ...state.formData, ...data } })),
      resetDraft: () => set(initialState),
    }),
    { name: "center-create-draft" }
  )
)
