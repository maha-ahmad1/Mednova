import type { AxiosInstance } from "axios";
import type { CreateProgramPayload, CreateProgramResponse } from "../types/create-program";

const buildCreateProgramFormData = (payload: CreateProgramPayload) => {
  const formData = new FormData();

  formData.append("creator_id", payload.creator_id);
  formData.append("title_ar", payload.title_ar);
  formData.append("description_ar", payload.description_ar);
  formData.append("what_you_will_learn_ar", payload.what_you_will_learn_ar);
  formData.append("price", String(payload.price));
  formData.append("currency", payload.currency);
  formData.append("cover_image", payload.cover_image);

  payload.videos.forEach((video, index) => {
    formData.append(`videos[${index}][title_ar]`, video.title_ar);
    formData.append(`videos[${index}][description_ar]`, video.description_ar);
    formData.append(`videos[${index}][duration_minute]`, String(video.duration_minute));
    formData.append(`videos[${index}][order]`, String(video.order));
    formData.append(`videos[${index}][is_program_intro]`, video.is_program_intro ? "1" : "0");
    formData.append(`videos[${index}][video_path]`, video.video_path);
  });

  return formData;
};

export const createProgram = async (
  axiosInstance: AxiosInstance,
  payload: CreateProgramPayload,
) => {
  const formData = buildCreateProgramFormData(payload);

  const response = await axiosInstance.post<CreateProgramResponse>(
    "/api/control-panel/programs",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return response.data;
};
