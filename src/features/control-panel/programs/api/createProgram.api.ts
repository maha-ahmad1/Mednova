import type { AxiosInstance } from "axios";
import type {
  AddProgramVideosPayload,
  CreateProgramPayload,
  CreateProgramResponse,
  UpdateProgramPayload,
  UpdateProgramVideoPayload,
} from "../types/create-program";

const appendVideoData = (
  formData: FormData,
  index: number,
  video: {
    title_ar: string;
    description_ar: string;
    duration_minute: number;
    order: number;
    is_program_intro: boolean;
    is_free: boolean;
    video_path?: File;
  },
) => {
  formData.append(`videos[${index}][title_ar]`, video.title_ar);
  formData.append(`videos[${index}][description_ar]`, video.description_ar);
  formData.append(`videos[${index}][duration_minute]`, String(video.duration_minute));
  formData.append(`videos[${index}][order]`, String(video.order));
  formData.append(`videos[${index}][is_program_intro]`, video.is_program_intro ? "1" : "0");
  formData.append(`videos[${index}][is_free]`, video.is_free ? "1" : "0");

  if (video.video_path instanceof File) {
    formData.append(`videos[${index}][video_path]`, video.video_path);
  }
};

const multipartConfig = {
  headers: {
    "Content-Type": "multipart/form-data",
  },
};

export const createProgram = async (axiosInstance: AxiosInstance, payload: CreateProgramPayload) => {
  const formData = new FormData();

  formData.append("creator_id", payload.creator_id);
  formData.append("title_ar", payload.title_ar);
  formData.append("description_ar", payload.description_ar);
  formData.append("what_you_will_learn_ar", payload.what_you_will_learn_ar);
  formData.append("price", String(payload.price));
  formData.append("currency", payload.currency);
  formData.append("cover_image", payload.cover_image);

  payload.videos.forEach((video, index) => appendVideoData(formData, index, video));

  const response = await axiosInstance.post<CreateProgramResponse>("/api/control-panel/programs", formData, multipartConfig);

  return response.data;
};

export const updateProgram = async (
  axiosInstance: AxiosInstance,
  programId: number,
  payload: UpdateProgramPayload,
) => {
  const formData = new FormData();

  formData.append("title_ar", payload.title_ar);
  formData.append("description_ar", payload.description_ar);
  formData.append("what_you_will_learn_ar", payload.what_you_will_learn_ar);
  formData.append("price", String(payload.price));
  formData.append("currency", payload.currency);

  if (payload.cover_image instanceof File) {
    formData.append("cover_image", payload.cover_image);
  }

  const response = await axiosInstance.post<CreateProgramResponse>(
    `/api/control-panel/programs/${programId}`,
    formData,
    multipartConfig,
  );

  return response.data;
};

export const addProgramVideos = async (axiosInstance: AxiosInstance, payload: AddProgramVideosPayload) => {
  const formData = new FormData();

  formData.append("program_id", String(payload.program_id));
  payload.videos.forEach((video, index) => appendVideoData(formData, index, video));

  const response = await axiosInstance.post<CreateProgramResponse>(
    "/api/control-panel/programs/videos",
    formData,
    multipartConfig,
  );

  return response.data;
};

export const updateProgramVideo = async (
  axiosInstance: AxiosInstance,
  videoId: number,
  payload: UpdateProgramVideoPayload,
) => {
  const formData = new FormData();
  appendVideoData(formData, 0, payload);

  const response = await axiosInstance.post<CreateProgramResponse>(
    `/api/control-panel/programs/videos/${videoId}`,
    formData,
    multipartConfig,
  );

  return response.data;
};

export const deleteProgramVideo = async (axiosInstance: AxiosInstance, videoId: number) => {
  const response = await axiosInstance.delete<CreateProgramResponse>(`/api/control-panel/programs/videos/${videoId}`);
  return response.data;
};

export const getProgramVideoDetails = async (axiosInstance: AxiosInstance, videoId: number) => {
  const response = await axiosInstance.get<CreateProgramResponse<{
    id: number;
    title_ar?: string | null;
    description_ar?: string | null;
    duration_minute?: number | null;
    order?: number | null;
    is_program_intro?: boolean | 0 | 1 | null;
    is_free?: boolean | 0 | 1 | null;
    video_path?: string | null;
  }>>(`/api/control-panel/programs/videos/${videoId}`);

  return response.data.data;
};
