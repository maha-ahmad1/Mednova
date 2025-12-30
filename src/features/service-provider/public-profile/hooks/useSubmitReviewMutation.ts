// import { useMutation } from '@tanstack/react-query';
// import { toast } from 'sonner';
// import { reviewsApi } from '../api/reviews.api';
// import { SubmitReviewPayload } from '../types/review';
// import type { AxiosInstance } from 'axios';
// import { useAxiosInstance as useAxios } from '@/lib/axios/axiosInstance';

// export const useSubmitReviewMutation = () => {
//   const axios = useAxios(); 

//   return useMutation({
//     mutationFn: (payload: SubmitReviewPayload) => 
//       reviewsApi.submitReview(axios, payload),
//     onSuccess: (data) => {
//       toast.success(data.message || 'تم إرسال تقييمك بنجاح!');
//     },
//     onError: (error: any) => {
//       const errorMessage = error.response?.data?.message || 
//                          error.message || 
//                          'حدث خطأ أثناء إرسال التقييم';
//       toast.error(errorMessage);
//     },
//   });
// };