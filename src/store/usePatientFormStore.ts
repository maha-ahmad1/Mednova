import { create } from "zustand";
import { persist } from "zustand/middleware";

interface PatientFormData {
  full_name?: string;
  email?: string;
  phone?: string;
  birth_date?: string;
  emergency_phone?: string;
  relationship?: string;
  gender?: "male" | "female";
  address?: string;
  image?: File | null;
}

interface PatientFormStore {
  data: PatientFormData;
  updateData: (newData: Partial<PatientFormData>) => void;
  resetData: () => void;
}

export const usePatientFormStore = create<PatientFormStore>()(
  persist(
    (set) => ({
      data: {},
      updateData: (newData) =>
        set((state) => ({ data: { ...state.data, ...newData } })),
      resetData: () => set({ data: {} }),
    }),
    {
      name: "patient-form-storage", 
    }
  )
);
