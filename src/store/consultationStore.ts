// stores/consultationStore.ts
import { create } from "zustand";
import type { ConsultationRequest } from "@/types/consultation";

interface ConsultationState {
  requests: ConsultationRequest[];
  setRequests: (requests: ConsultationRequest[]) => void;
  addRequest: (request: ConsultationRequest) => void;
  updateRequest: (id: number, updates: Partial<ConsultationRequest>) => void;
  removeRequest: (id: number) => void;
}

export const useConsultationStore = create<ConsultationState>((set) => ({
  requests: [],
  setRequests: (requests) => set({ requests }),
  addRequest: (request) =>
    set((state) => {
      // تجنب التكرار
      const exists = state.requests.find(r => r.id === request.id);
      if (exists) {
        return { 
          requests: state.requests.map(r => r.id === request.id ? request : r) 
        };
      }
      return { 
        requests: [request, ...state.requests] 
      };
    }),
  updateRequest: (id, updates) =>
    set((state) => ({
      requests: state.requests.map((request) =>
        request.id === id ? { ...request, ...updates } : request
      ),
    })),
  removeRequest: (id) =>
    set((state) => ({
      requests: state.requests.filter((request) => request.id !== id),
    })),
}));