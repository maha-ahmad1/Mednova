import type { AxiosInstance } from "axios";
import type { MyCoursesResponse } from "../types/myCourses";

export const getMyCourses = async (
  axiosInstance: AxiosInstance,
  page = 1,
  perPage = 15,
): Promise<MyCoursesResponse> => {
  const response = await axiosInstance.get<MyCoursesResponse>("/api/profile/courses", {
    params: { page, per_page: perPage },
  });

  return response.data;
};
