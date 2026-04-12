import { create } from "zustand";
import type { ConsultationRequest } from "@/types/consultation";

interface ConsultationState {
  requests: ConsultationRequest[];
  setRequests: (requests: ConsultationRequest[]) => void;
  hydrateRequests: (requests: ConsultationRequest[]) => void;
  addRequest: (request: ConsultationRequest) => void;
  updateRequest: (id: number, updates: Partial<ConsultationRequest>) => void;
  removeRequest: (id: number) => void;
}

const STATUS_WEIGHT: Record<ConsultationRequest["status"], number> = {
  pending: 1,
  accepted: 2,
  active: 3,
  completed: 4,
  cancelled: 4,
};

const isIncomingStatusNewer = (
  existingStatus: ConsultationRequest["status"],
  incomingStatus: ConsultationRequest["status"],
): boolean => STATUS_WEIGHT[incomingStatus] >= STATUS_WEIGHT[existingStatus];

export const useConsultationStore = create<ConsultationState>((set, get) => ({
  requests: [],
  setRequests: (requests) => {
    console.log("🔄 تحديث جميع الطلبات:", requests);
    set({ requests });
  },
  hydrateRequests: (apiRequests) => {
    set((state) => {
      const existingById = new Map(state.requests.map((request) => [request.id, request]));

      apiRequests.forEach((apiRequest) => {
        const existing = existingById.get(apiRequest.id);

        if (!existing) {
          existingById.set(apiRequest.id, apiRequest);
          return;
        }

        if (isIncomingStatusNewer(existing.status, apiRequest.status)) {
          existingById.set(apiRequest.id, {
            ...existing,
            ...apiRequest,
          });
          return;
        }

        existingById.set(apiRequest.id, {
          ...apiRequest,
          ...existing,
          status: existing.status,
          updated_at: existing.updated_at,
          video_room_link: existing.video_room_link || apiRequest.video_room_link,
        });
      });

      const mergedRequests = Array.from(existingById.values());
      console.log("🧩 تم دمج طلبات API مع الحالة المحلية:", mergedRequests);

      return { requests: mergedRequests };
    });
  },
  addRequest: (request) => {
    const state = get();
    const existing = state.requests.find((r) => r.id === request.id);

    if (existing) {
      if (!isIncomingStatusNewer(existing.status, request.status)) {
        console.debug("[status-guard] تجاهل طلب أقدم:", {
          id: request.id,
          existingStatus: existing.status,
          incomingStatus: request.status,
        });
        return;
      }

      console.log("✏️ تحديث طلب موجود بإصدار أحدث:", request.id);
      set({
        requests: state.requests.map((r) =>
          r.id === request.id
            ? {
                ...r,
                ...request,
              }
            : r,
        ),
      });
      return;
    }

    console.log("➕ إضافة طلب جديد:", request.id);
    set({ requests: [...state.requests, request] });
  },

  updateRequest: (id, updates) =>
    set((state) => {
      console.log("✏️ تحديث الطلب:", id, updates);
      const updatedRequests = state.requests.map((request) =>
        request.id === id ? { ...request, ...updates } : request,
      );
      return { requests: updatedRequests };
    }),

  removeRequest: (id) =>
    set((state) => {
      console.log("🗑️ حذف الطلب:", id);
      return {
        requests: state.requests.filter((request) => request.id !== id),
      };
    }),
}));
