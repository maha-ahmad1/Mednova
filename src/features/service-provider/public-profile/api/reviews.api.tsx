import type { AxiosInstance } from 'axios';
import { SubmitReviewPayload, SubmitReviewResponse } from '../types/review';

export const reviewsApi = {
  submitReview: async (
    axios: AxiosInstance,
    payload: SubmitReviewPayload
  ): Promise<SubmitReviewResponse> => {
    const response = await axios.post<SubmitReviewResponse>(
      'https://mednovacare.com/api/rating/store',
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          // يمكن إضافة أي هيدرات مطلوبة مثل التوكن
           //'Authorization': `Bearer ${token}`
        },
      }
    );
    
    return response.data;
  },

//   getReviews: async (
//     axios: AxiosInstance,
//     params: {
//       reviewee_id: number;
//       reviewee_type: 'customer' | 'program' | 'platform';
//       page?: number;
//       limit?: number;
//     }
//   ) => {
//     const response = await axios.get('/api/rating/reviews', { params });
//     return response.data;
//   },

//   updateReview: async (
//     axios: AxiosInstance,
//     reviewId: number,
//     payload: Partial<SubmitReviewPayload>
//   ) => {
//     const response = await axios.put(`/api/rating/${reviewId}`, payload);
//     return response.data;
//   },

//   deleteReview: async (axios: AxiosInstance, reviewId: number) => {
//     const response = await axios.delete(`/api/rating/${reviewId}`);
//     return response.data;
//   },
};