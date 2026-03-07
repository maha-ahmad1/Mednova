import {
  useMutation,
  useQuery,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";
import { useAxiosInstance } from "@/lib/axios/axiosInstance";
import type { ChatRequest, Message, SendMessageData } from "@/types/chat";
import type { AxiosError, AxiosProgressEvent } from "axios";
import { toast } from "sonner";
import { logger } from "@/lib/logger";

interface ApiErrorResponse {
  success: boolean;
  message: string;
  data?: {
    error?: string;
  };
  status?: string;
}

const CHAT_LIST_ENDPOINTS = [
  "/api/messages/current-chats",
  "/api/messages/chats",
  "/api/chat-requests",
  "/api/chat-requests/current",
];

const normalizeChatsResponse = (payload: unknown): ChatRequest[] => {
  if (!payload || typeof payload !== "object") return [];

  const asRecord = payload as Record<string, unknown>;
  const possibleCollections: unknown[] = [
    payload,
    asRecord.data,
    asRecord.chats,
    asRecord.chat_requests,
  ];

  for (const collection of possibleCollections) {
    if (Array.isArray(collection)) {
      return collection as ChatRequest[];
    }

    if (collection && typeof collection === "object") {
      const nestedRecord = collection as Record<string, unknown>;
      for (const value of Object.values(nestedRecord)) {
        if (Array.isArray(value)) {
          return value as ChatRequest[];
        }
      }
    }
  }

  return [];
};

export const useCurrentChats = () => {
  const axiosInstance = useAxiosInstance();

  return useQuery({
    queryKey: ["current-chats"],
    queryFn: async () => {
      let lastError: unknown;

      for (const endpoint of CHAT_LIST_ENDPOINTS) {
        try {
          const response = await axiosInstance.get(endpoint);
          if (response.data?.success === false) {
            continue;
          }

          const chats = normalizeChatsResponse(response.data?.data ?? response.data);
          return chats
            .filter((chat) => chat && typeof chat.id === "number")
            .sort(
              (a, b) =>
                new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
            );
        } catch (error) {
          lastError = error;
        }
      }

      if (lastError) {
        throw lastError;
      }

      return [] as ChatRequest[];
    },
    staleTime: 1000 * 20,
    refetchInterval: 1000 * 12,
    refetchOnWindowFocus: true,
  });
};

export const useMessages = (chatRequestId: number, limit = 15) => {
  const axiosInstance = useAxiosInstance();

  return useInfiniteQuery({
    queryKey: ["messages", chatRequestId],
    queryFn: async ({ pageParam = null }) => {
      const params = new URLSearchParams();
      params.append("limit", String(limit));
      params.append("order", "desc"); // إضافة ترتيب تنازلي

      // معالجة خاصة للـ cursor اليدوي
      if (pageParam) {
        // تحقق إذا كان cursor يدوياً (timestamp)
        if (typeof pageParam === "string" && /^\d+$/.test(pageParam)) {
          // هذا cursor يدوي، أضفه كـ created_before
          params.append("created_before", pageParam);
          console.log(`📅 استخدام cursor يدوي (timestamp): ${pageParam}`);
        } else {
          // استخدام الـ cursor العادي
          params.append("next_cursor", pageParam);
          console.log(`🎯 استخدام cursor عادي: ${pageParam}`);
        }
      }

      const response = await axiosInstance.get(
        `/api/messages/${chatRequestId}?${params.toString()}`
      );

      if (!response.data.success) {
        throw new Error("فشل في جلب الرسائل");
      }

      const apiData = response.data.data;
      console.log("📨 API Response:", {
        keys: Object.keys(apiData),
        next_cursor: apiData.next_cursor,
        hasNextCursor: !!apiData.next_cursor,
      });

       let messagesArray: Message[] = [];
 
      if (apiData["0"] && Array.isArray(apiData["0"])) {
        messagesArray = apiData["0"];
      } else if (apiData.data && Array.isArray(apiData.data)) {
        messagesArray = apiData.data;
      } else {
        const keys = Object.keys(apiData);
        for (const key of keys) {
          if (Array.isArray(apiData[key]) && apiData[key].length > 0) {
            messagesArray = apiData[key];
            break;
          }
        }
      }

      console.log(`📝 الرسائل المستلمة: ${messagesArray.length} رسالة`);

    

      const cleanedMessages = messagesArray.filter(
        (msg: Message) =>
          msg &&
          typeof msg === "object" &&
          msg.id &&
          msg.sender_id &&
          msg.created_at
      );

      return {
        data: cleanedMessages,
        next_cursor: apiData.next_cursor,
        // manual_cursor: manualNextCursor, // إضافة cursor يدوي
      };
    },
getNextPageParam: (lastPage) => {
  console.log(`🔍 فحص للصفحة التالية:`, {
    nextCursor: lastPage.next_cursor,
    dataLength: lastPage.data?.length || 0,
    hasData: !!lastPage.data && lastPage.data.length > 0,
  });

  // التحقق البسيط: إذا كان هناك cursor وكانت هناك بيانات
  if (lastPage.next_cursor && lastPage.data && lastPage.data.length > 0) {
    console.log(`✅ إرجاع cursor للصفحة التالية: ${lastPage.next_cursor.substring(0, 50)}...`);
    return lastPage.next_cursor;
  }

  console.log("❌ لا يوجد cursor صالح للصفحة التالية");
  return undefined;
},
    enabled: !!chatRequestId && chatRequestId > 0,
    staleTime: 1000 * 60 * 5,
    initialPageParam: null,
    retry: 1,
    refetchOnWindowFocus: false,
    // إضافة إعدادات مهمة للتحديث التلقائي
    refetchInterval: 30000, // تحديث كل 30 ثانية
  });
};

export const useSendMessage = () => {
  const axiosInstance = useAxiosInstance();
  const queryClient = useQueryClient();

  return useMutation({
    // Accept either:
    // - SendMessageData (no attachment)
    // - FormData
    // - an object: { formData: FormData, onUploadProgress?: (ev: ProgressEvent) => void, chat_request_id?: number }
    mutationFn: async (
      payload:
        | SendMessageData
        | FormData
        | {
            formData: FormData;
            onUploadProgress?: (ev?: AxiosProgressEvent) => void;
            chat_request_id?: number;
          }
    ) => {
      let response;

      // If caller passed wrapper with formData and callback
      if (payload && typeof payload === "object" && "formData" in payload) {
        const wrapper = payload as {
          formData: FormData;
          onUploadProgress?: (ev?: AxiosProgressEvent) => void;
        };
        response = await axiosInstance.post(
          "/api/messages/sent",
          wrapper.formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
            onUploadProgress: wrapper.onUploadProgress,
          }
        );
      } else if (payload instanceof FormData) {
        response = await axiosInstance.post("/api/messages/sent", payload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        const d = payload as SendMessageData;
        response = await axiosInstance.post("/api/messages/sent", {
          ...d,
          chat_request_id: String(d.chat_request_id),
        });
      }

      if (!response.data.success) {
        const errorMsg =
          response.data.data?.error ||
          response.data.message ||
          "فشل في إرسال الرسالة";
        throw new Error(errorMsg);
      }

      return response.data.data;
    },
    onSuccess: (data, variables) => {
      // Determine chat_request_id whether variables is FormData or object
      let chatId: number | null = null;
      if (variables instanceof FormData) {
        const v = variables.get("chat_request_id");
        chatId = v ? Number(v) : null;
      } else {
        chatId = (variables as SendMessageData).chat_request_id;
      }

      if (chatId) {
        queryClient.invalidateQueries({ queryKey: ["messages", chatId] });
        queryClient.invalidateQueries({ queryKey: ["current-chats"] });
      }
      toast.success("تم إرسال الرسالة بنجاح");
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      // console.error('❌ خطأ في إرسال الرسالة:', error);

      const errorData = error.response?.data;
      const errorMessage =
        errorData?.data?.error ||
        errorData?.message ||
        error.message ||
        "حدث خطأ في الإرسال";
      toast.error(errorMessage);
    },
  });
};

export const useMarkAsRead = () => {
  const axiosInstance = useAxiosInstance();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (senderId: number) => {
      const response = await axiosInstance.get(
        `/api/messages/mark-as-read/${senderId}`
      );

      if (!response.data.success) {
        throw new Error(
          response.data.data?.error ||
            response.data.message ||
            "فشل في تحديث حالة الرسالة"
        );
      }

      return response.data.data;
    },
    onSuccess: (data, senderId) => {
      logger.info(`✅ تم تعليم رسائل المرسل ${senderId} كمقروءة`);
      queryClient.invalidateQueries({ queryKey: ["current-chats"] });
    },
    onError: (error: AxiosError<ApiErrorResponse>, senderId) => {
      logger.error(`❌ فشل في تعليم رسائل المرسل ${senderId}:`, error);

      const errorData = error.response?.data;
      const errorMessage =
        errorData?.data?.error ||
        errorData?.message ||
        error.message ||
        "فشل في تحديث حالة القراءة";
      toast.error(errorMessage);
    },
  });
};
