import { useQuery } from "@tanstack/react-query";
import { useAxiosInstance } from "@/lib/axios/axiosInstance";
import { getMyCourses } from "../api";

export const useMyCoursesQuery = (page: number, perPage = 15) => {
  const axiosInstance = useAxiosInstance();

  return useQuery({
    queryKey: ["my-courses", page, perPage],
    queryFn: () => getMyCourses(axiosInstance, page, perPage),
  });
};
