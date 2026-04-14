// // stores/consultationStore.ts
// import { create } from "zustand";
// import type { ConsultationRequest } from "@/types/consultation";

// interface ConsultationState {
//   requests: ConsultationRequest[];
//   setRequests: (requests: ConsultationRequest[]) => void;
//   addRequest: (request: ConsultationRequest) => void;
//   updateRequest: (id: number, updates: Partial<ConsultationRequest>) => void;
//   removeRequest: (id: number) => void;
// }

// export const useConsultationStore = create<ConsultationState>((set, get) => ({
//   requests: [],
//   setRequests: (requests) => {
//     console.log("🔄 تحديث جميع الطلبات:", requests);
//     set({ requests });
//   },
//   addRequest: (request) =>
//     set((state) => {
//       console.log("➕ إضافة طلب جديد:", request);

//       // تجنب التكرار
//       const exists = state.requests.find((r) => r.id === request.id);
//       if (exists) {
//         console.log("⚠️ الطلب موجود مسبقاً، يتم التحديث:", request.id);
//         return {
//           requests: state.requests.map((r) =>
//             r.id === request.id ? request : r
//           ),
//         };
//       }

//       console.log("✅ إضافة طلب جديد إلى القائمة");
//       return {
//         requests: [request, ...state.requests],
//       };
//     }),
//   updateRequest: (id, updates) =>
//     set((state) => {
//       console.log("✏️ تحديث الطلب:", id, updates);
//       const updatedRequests = state.requests.map((request) =>
//         request.id === id ? { ...request, ...updates } : request
//       );
//       return { requests: updatedRequests };
//     }),
//   removeRequest: (id) =>
//     set((state) => {
//       console.log("🗑️ حذف الطلب:", id);
//       return {
//         requests: state.requests.filter((request) => request.id !== id),
//       };
//     }),
// }));




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
    console.log("🧪 [TRACE][ConsultationStore] setRequests CALLED", {
      timestamp: new Date().toISOString(),
      total: requests.length,
      ids: requests.map((r) => ({
        id: r?.id,
        idType: typeof r?.id,
        status: r?.status,
      })),
    });
    console.log("🔄 تحديث جميع الطلبات:", requests);
    set({ requests });
  },
  
  addRequest: (request) => {
    console.log("📌 [TRACE] addRequest EXECUTED", {
      id: request?.id,
      timestamp: new Date().toISOString()
    });
    console.trace("STORE CALL STACK");
    const state = get();
    console.log("🧪 [TRACE][ConsultationStore] addRequest PRE-CHECK", {
      incomingId: request?.id,
      incomingIdType: typeof request?.id,
      existingIds: state.requests.map((r) => ({
        id: r.id,
        idType: typeof r.id,
        status: r.status,
      })),
    });
    const exists = state.requests.find(r => r.id === request.id);
    
    if (exists) {
      console.warn('🚫 الطلب موجود مسبقاً، لا يتم الإضافة:', request.id);
      
      // 🔥 **المشكلة هنا:** يسبب حلقة لا نهائية
      // التحديث يعيد تعيين status إلى pending
      const needsUpdate = 
        (!exists.video_room_link && request.video_room_link) ||
        (exists.status === 'pending' && request.status === 'accepted');
      
      // ⚠️ **خطأ:** هذا يسمح بتحديثات خاطئة
      if (needsUpdate) {
        console.log('✏️ تحديث بيانات الطلب:', request.id);
        set({
          requests: state.requests.map(r => 
            r.id === request.id 
              ? { ...r, ...request }  // ⚠️ هنا تكمن المشكلة!
              : r
          )
        });
      }
      return;
    }
    
    console.log('➕ إضافة طلب جديد:', request.id);
    set({ requests: [...state.requests, request] });
  },

  updateRequest: (id, updates) =>
    set((state) => {
      console.log("✏️ تحديث الطلب:", id, updates);
      const updatedRequests = state.requests.map((request) =>
        request.id === id ? { ...request, ...updates } : request
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
