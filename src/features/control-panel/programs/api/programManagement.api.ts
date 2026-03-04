import type { AxiosInstance } from "axios";
import type { ControlPanelProgramDetails, ProgramStatus } from "../types/program";

interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
  status: string;
}

interface ProgramDetailsApiResponse {
  id: number;
  title?: string | null;
  title_ar?: string | null;
  description?: string | null;
  description_ar?: string | null;
  what_you_will_learn?: string | null;
  what_you_will_learn_ar?: string | null;
  creator?: { full_name?: string | null; name?: string | null } | null;
  creator_name?: string | null;
  status: ProgramStatus;
  price: number | string | null;
  currency: string | null;
  cover_image: string | null;
  videos?: Array<{
    id: number;
    title?: string | null;
    title_ar?: string | null;
    description?: string | null;
    description_ar?: string | null;
    duration_minute?: number | null;
    order?: number | null;
    is_program_intro?: boolean | 0 | 1 | null;
    is_free?: boolean | 0 | 1 | null;
    video_path?: string | null;
  }>;
}

export const approveProgram = async (axiosInstance: AxiosInstance, programId: number) => {
  const response = await axiosInstance.patch<ApiResponse>(`/api/control-panel/programs/${programId}/approve`);
  return response.data;
};

export const rejectProgram = async (axiosInstance: AxiosInstance, programId: number) => {
  const response = await axiosInstance.patch<ApiResponse>(`/api/control-panel/programs/${programId}/reject`);
  return response.data;
};

export const deleteProgram = async (axiosInstance: AxiosInstance, programId: number) => {
  const response = await axiosInstance.delete<ApiResponse>(`/api/control-panel/programs/${programId}`);
  return response.data;
};

export const getProgramDetails = async (
  axiosInstance: AxiosInstance,
  programId: string,
): Promise<ControlPanelProgramDetails> => {
  const response = await axiosInstance.get<ApiResponse<ProgramDetailsApiResponse>>(
    `/api/control-panel/programs/${programId}`,
  );

  const program = response.data.data;

  return {
    id: program.id,
    title: program.title_ar ?? program.title ?? "-",
    titleAr: program.title_ar ?? "",
    description: program.description_ar ?? program.description ?? "-",
    descriptionAr: program.description_ar ?? "",
    whatYouWillLearn: program.what_you_will_learn_ar ?? program.what_you_will_learn ?? "-",
    whatYouWillLearnAr: program.what_you_will_learn_ar ?? "",
    creator: program.creator?.full_name ?? program.creator?.name ?? program.creator_name ?? "-",
    status: program.status,
    price: program.price === null ? null : Number(program.price),
    currency: program.currency,
    coverImage: program.cover_image,
    videos:
      program.videos?.map((video) => ({
        id: video.id,
        title: video.title_ar ?? video.title ?? "-",
        description: video.description_ar ?? video.description ?? "-",
        titleAr: video.title_ar ?? "",
        descriptionAr: video.description_ar ?? "",
        durationMinute: video.duration_minute ?? null,
        order: video.order ?? null,
        isProgramIntro: Boolean(video.is_program_intro),
        isFree: Boolean(video.is_free),
        videoPath: video.video_path ?? null,
      })) ?? [],
  };
};
