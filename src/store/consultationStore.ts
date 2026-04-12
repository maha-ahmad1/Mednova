import { create } from "zustand";
import type { ConsultationRequest } from "@/types/consultation";

interface ConsultationState {
  requests: ConsultationRequest[];
  setRequests: (requests: ConsultationRequest[]) => void;
  addRequest: (request: ConsultationRequest) => void;
  updateRequest: (id: number, updates: Partial<ConsultationRequest>) => void;
  removeRequest: (id: number) => void;
}

const dedupeRequestsById = (requests: ConsultationRequest[]): ConsultationRequest[] => {
  const map = new Map<number, ConsultationRequest>();

  requests.forEach((request) => {
    const existing = map.get(request.id);
    if (!existing) {
      map.set(request.id, request);
      return;
    }

    const existingTime = new Date(existing.updated_at || existing.created_at || 0).getTime();
    const candidateTime = new Date(request.updated_at || request.created_at || 0).getTime();

    map.set(request.id, candidateTime >= existingTime ? request : existing);
  });

  return Array.from(map.values());
};

export const useConsultationStore = create<ConsultationState>((set) => ({
  requests: [],

  setRequests: (requests) => {
    const dedupedRequests = dedupeRequestsById(requests);
    console.log("🔄 SET REQUESTS", {
      incomingCount: requests.length,
      dedupedCount: dedupedRequests.length,
    });

    set({ requests: dedupedRequests });
  },

  addRequest: (request) => {
    set((state) => {
      const exists = state.requests.some((r) => r.id === request.id);

      if (exists) {
        console.log("⏭️ REQUEST ADD SKIPPED (already exists)", { requestId: request.id });
        return state;
      }

      const nextRequests = dedupeRequestsById([request, ...state.requests]);
      console.log("✅ REQUEST ADDED TO STORE", {
        requestId: request.id,
        totalAfterAdd: nextRequests.length,
      });

      return { requests: nextRequests };
    });
  },

  updateRequest: (id, updates) =>
    set((state) => {
      const exists = state.requests.some((request) => request.id === id);
      if (!exists) {
        console.log("⏭️ REQUEST UPDATE SKIPPED (not found)", { requestId: id });
        return state;
      }

      const nextRequests = state.requests.map((request) =>
        request.id === id ? { ...request, ...updates } : request,
      );

      console.log("✏️ REQUEST UPDATED", { requestId: id, updates });
      return { requests: dedupeRequestsById(nextRequests) };
    }),

  removeRequest: (id) =>
    set((state) => {
      console.log("🗑️ حذف الطلب:", id);
      return {
        requests: state.requests.filter((request) => request.id !== id),
      };
    }),
}));
