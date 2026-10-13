import type { AxiosInstance } from "axios";

export const deleteConsultantProgram = async (
  axiosInstance: AxiosInstance,
  id: number,
): Promise<{ success: boolean; message: string; status: string }> => {
  const response = await axiosInstance.delete<{ success: boolean; message: string; status: string }>(
    `/api/consultant/programs/${id}`,
  );

  return response.data;
};
