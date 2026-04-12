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

  setRequests: (requests) => {
    console.log("🔄 تحديث جميع الطلبات:", requests);
    set({ requests });
  },

  addRequest: (request) => {
    set((state) => {
      const exists = state.requests.some((r) => r.id === request.id);

      if (exists) {
        console.log("⏭️ REQUEST ADD SKIPPED (already exists)", { requestId: request.id });
        return state;
      }

      console.log("✅ REQUEST ADDED TO STORE", { requestId: request.id });
      return { requests: [request, ...state.requests] };
    });
  },

  updateRequest: (id, updates) =>
    set((state) => {
      console.log("✏️ تحديث الطلب:", id, updates);
      return {
        requests: state.requests.map((request) =>
          request.id === id ? { ...request, ...updates } : request,
        ),
      };
    }),

  removeRequest: (id) =>
    set((state) => {
      console.log("🗑️ حذف الطلب:", id);
      return {
        requests: state.requests.filter((request) => request.id !== id),
      };
    }),
}));
