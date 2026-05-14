import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface ConsultationData {
  providerId: string;
  consultantType: 'therapist' | 'rehabilitation_center';
}

interface ConsultationTypeStore {
  currentConsultation: ConsultationData | null;
  setConsultation: (data: ConsultationData) => void;
  clearConsultation: () => void;
}

export const useConsultationTypeStore = create<ConsultationTypeStore>()(
  persist(
    (set) => ({
      currentConsultation: null,

      setConsultation: (data) =>
        set({ currentConsultation: data }),

      clearConsultation: () =>
        set({ currentConsultation: null }),
    }),
    {
      name: 'consultation-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
