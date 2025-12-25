import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface ConsultationData {
  providerId:  string;
  providerName: string;
  consultationType: 'chat' | 'video';
  consultantType: 'therapist' | 'rehabilitation_center';
  // Optional fields for video consultations
  requestedDay?: string;
  requestedTime?: string;
  appointmentType?: 'online' | 'in-person';
  video_room_link?: string;
}

interface ConsultationTypeStore {
  currentConsultation: ConsultationData | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setConsultation: (data: ConsultationData) => void;
  clearConsultation: () => void;
  startLoading: () => void;
  stopLoading: () => void;
  setError: (error: string | null) => void;
}

export const useConsultationTypeStore= create<ConsultationTypeStore>()(
  persist(
    (set) => ({
      currentConsultation: null,
      isLoading: false,
      error: null,
      
      setConsultation: (data) => 
        set({ currentConsultation: data, error: null }),
      
      clearConsultation: () => 
        set({ currentConsultation: null, error: null }),
      
      startLoading: () => set({ isLoading: true }),
      stopLoading: () => set({ isLoading: false }),
      
      setError: (error) => set({ error }),
    }),
    {
      name: 'consultation-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);