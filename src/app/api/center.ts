import type { AxiosInstance } from "axios";

export interface CenterFormValues {
  schedule_id?: number | string;
  customer_id: string;
  gender?: "Male" | "Female";
  birth_date?: string;
  image?: string | File;
  specialty_id?: string[];
  year_establishment?: string;
  has_commercial_registration?: boolean;
  commercial_registration_number?: string;
  commercial_registration_file?: File | null;
  commercial_registration_authority?: string;
  license_authority?: string;
  license_file?: File | null;
  license_number?: string;
  bio?: string;
  day_of_week?: string[];
  is_have_evening_time?: boolean;
  start_time_morning?: string;
  end_time_morning?: string;
  start_time_evening?: string;
  end_time_evening?: string;
  city?: string;
  country?: string;
  formatted_address?: string;
  timezone?: string;
  video_consultation_price?: string | number;
  chat_consultation_price?: string | number;
  currency?: string;
  name_center?: string;
}
//هذه هي الدالة التي تحول البيانات من فورم عادي إلى FormData ثم ترسلها للسيرفر عبر API:
export const storeCenterDetails = async (
  axios: AxiosInstance,
  data: CenterFormValues
) => {
  const formData = new FormData();

  formData.append("customer_id", data.customer_id);
  formData.append("gender", data.gender || "");
  formData.append("birth_date", data.birth_date || "");
  formData.append("image", data.image || "");
  // if (data.schedule_id) {
  //   formData.append("schedule_id", data.schedule_id);
  // }

  // Handle specialty_id as array
  if (Array.isArray(data.specialty_id) && data.specialty_id.length > 0) {
    data.specialty_id.forEach((id) => {
      formData.append("specialty_id[]", id);
    });
  }

  formData.append("year_establishment", data.year_establishment || "");
  formData.append(
    "has_commercial_registration",
    String(data.has_commercial_registration ? 1 : 0)
  );

  if (data.has_commercial_registration) {
    formData.append(
      "commercial_registration_number",
      data.commercial_registration_number || ""
    );
    if (data.commercial_registration_file) {
      formData.append(
        "commercial_registration_file",
        data.commercial_registration_file
      );
    }
    formData.append(
      "commercial_registration_authority",
      data.commercial_registration_authority || ""
    );
  }
  formData.append("name_center", data.name_center || "");

  formData.append("license_authority", data.license_authority || "");
  if (data.license_file) {
    formData.append("license_file", data.license_file);
  }
  formData.append("license_number", data.license_number || "");
  formData.append("bio", data.bio || "");

  // Handle day_of_week as array
  if (Array.isArray(data.day_of_week) && data.day_of_week.length > 0) {
    data.day_of_week.forEach((day) => {
      formData.append("day_of_week[]", day);
    });
  }

  formData.append("start_time_morning", data.start_time_morning || "");
  formData.append("end_time_morning", data.end_time_morning || "");

  const parseHasEvening = (val: unknown) => {
    if (val === true) return true;
    if (String(val) === "1") return true;
    return false;
  };

  const hasEvening = parseHasEvening(data.is_have_evening_time);
  formData.append("is_have_evening_time", String(hasEvening ? 1 : 0));

  if (hasEvening) {
    formData.append("start_time_evening", data.start_time_evening || "");
    formData.append("end_time_evening", data.end_time_evening || "");
  }

  formData.append("city", data.city || "");
  formData.append("country", data.country || "");
  formData.append("formatted_address", data.formatted_address || "");
  formData.append("timezone", data.timezone || "");
  formData.append(
    "video_consultation_price",
    data.video_consultation_price?.toString() || ""
  );
  formData.append(
    "chat_consultation_price",
    data.chat_consultation_price?.toString() || ""
  );
  formData.append("currency", data.currency || "");
  const response = await axios.post("/api/center/store", formData);

  return response.data;
};
// يعني انا هنا بتعامل مع الداتا لي من الفورم وبجهزها للارسال وبالكستم هوك بخليه يستقبله ويهندل الايرور هناك
