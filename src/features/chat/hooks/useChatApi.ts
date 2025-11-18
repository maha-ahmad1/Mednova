import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAxiosInstance } from '@/lib/axios/axiosInstance';
import type { Message, ChatRequest, SendMessageData } from '@/types/chat';
import type { AxiosError } from 'axios';
import { toast } from 'sonner';

// تعريف نوع لاستجابة الخطأ من API
interface ApiErrorResponse {
  success: boolean;
  message: string;
  data?: {
    error?: string;
  };
  status?: string;
}

export const useMessages = (chatRequestId: number, limit?: number) => {
  const axiosInstance = useAxiosInstance();

  return useQuery({
    queryKey: ['messages', chatRequestId, limit],
    queryFn: async (): Promise<Message[]> => {
      const url = limit 
        ? `/api/messages/${String(chatRequestId)}?limit=${limit}`
        : `/api/messages/${String(chatRequestId)}`;
      
      const response = await axiosInstance.get(url);
      
      if (!response.data.success) {
        console.error('❌ فشل في جلب الرسائل:', response.data);
        throw new Error(response.data.message || 'فشل في جلب الرسائل');
      }
      
      return response.data.data || [];
    },
    enabled: !!chatRequestId && chatRequestId > 0, 
    retry: 1, 
  });
};

export const useSendMessage = () => {
  const axiosInstance = useAxiosInstance();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: SendMessageData) => {
      const response = await axiosInstance.post('/api/messages/sent', {
        ...data,
        chat_request_id: String(data.chat_request_id) 
      });
      
      if (!response.data.success) {
        const errorMsg = response.data.data?.error || response.data.message || 'فشل في إرسال الرسالة';
        console.error('❌ فشل في إرسال الرسالة:', response.data);
        throw new Error(errorMsg);
      }
      
      return response.data.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['messages', variables.chat_request_id] });
      toast.success('تم إرسال الرسالة بنجاح');
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      console.error('❌ خطأ في إرسال الرسالة:', error);
      
      const errorData = error.response?.data;
      const errorMessage = errorData?.data?.error || 
                          errorData?.message || 
                          error.message || 
                          'حدث خطأ في الإرسال';
      toast.error(errorMessage);
    },
  });
};

// export const useUpdateChat = () => {
//   const axiosInstance = useAxiosInstance();

//   return useMutation({
//     mutationFn: async (data: UpdateChatData) => {
//       const response = await axiosInstance.post('/api/consultation-request/chat/update-chatting', data);
      
//       if (!response.data.success) {
//         throw new Error(response.data.message || 'فشل في تحديث بيانات الشات');
//       }
      
//       return response.data.data;
//     },
//     onError: (error: AxiosError<ApiErrorResponse>) => {
//       console.error('❌ خطأ في تحديث الشات:', error);
//       const errorData = error.response?.data;
//       const errorMessage = errorData?.message || error.message || 'فشل في تحديث بيانات الشات';
//       toast.error(errorMessage);
//     },
//   });
// };

export const useMarkAsRead = () => {
  const axiosInstance = useAxiosInstance();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (senderId: number) => {
      const response = await axiosInstance.get(`/api/messages/mark-as-read/${senderId}`);
      
      if (!response.data.success) {
        throw new Error(response.data.data?.error || response.data.message || 'فشل في تحديث حالة الرسالة');
      }
      
      return response.data.data;
    },
    onSuccess: (data, variables) => {
      console.log("✅ تم تعليم رسائل المرسل كمقروءة:", variables);
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      console.error('❌ خطأ في تعليم الرسائل كمقروءة:', error);
      
      const errorData = error.response?.data;
      const errorMessage = errorData?.data?.error || 
                          errorData?.message || 
                          error.message || 
                          'فشل في تحديث حالة القراءة';
      toast.error(errorMessage);
    },
  });
};

// الحصول على المحادثات الحالية
export const useCurrentChats = () => {
  const axiosInstance = useAxiosInstance();

  return useQuery({
    queryKey: ['current-chats'],
    queryFn: async (): Promise<ChatRequest[]> => {
      const response = await axiosInstance.get('/api/messages/messengers/current-user');
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'فشل في جلب المحادثات');
      }
      
      return response.data.data || [];
    },
  });
};