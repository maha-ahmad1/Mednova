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

export const useConsultationStore = create<ConsultationState>((set, get) => ({
  requests: [],
  setRequests: (requests) => {
    console.log("🔄 تحديث جميع الطلبات:", requests);
    set({ requests });
  },
  addRequest: (request) =>
    set((state) => {
      console.log("➕ إضافة طلب جديد:", request);
      
      // تجنب التكرار
      const exists = state.requests.find(r => r.id === request.id);
      if (exists) {
        console.log("⚠️ الطلب موجود مسبقاً، يتم التحديث:", request.id);
        return { 
          requests: state.requests.map(r => r.id === request.id ? request : r) 
        };
      }
      
      console.log("✅ إضافة طلب جديد إلى القائمة");
      return { 
        requests: [request, ...state.requests] 
      };
    }),
  updateRequest: (id, updates) =>
    set((state) => {
      console.log("✏️ تحديث الطلب:", id, updates);
      return {
        requests: state.requests.map((request) =>
          request.id === id ? { ...request, ...updates } : request
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