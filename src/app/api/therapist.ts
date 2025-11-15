import { AxiosInstance } from "axios";

export interface TherapistFormValues {
  schedule_id?: string;
  customer_id: string;
  full_name?: string;
  email?: string;
  // image is optional for updates that don't change the image
  image?: string | File;
  gender?: "Male" | "Female";
  formatted_address?: string;
  medical_specialties_id?: string;
  university_name?: string;
  graduation_year?: string;
  countries_certified?: string;
  experience_years?: number;
  license_number?: string;
  license_authority?: string;
  certificate_file?: File | null;
  license_file?: File | null;
  bio?: string;
  birth_date?: string;
  phone?: string;
  location_id?: number;
  country?: string;
  city?: string;
  day_of_week?: string[];
  start_time_morning?: string;
  end_time_morning?: string;
  is_have_evening_time?: boolean;
  start_time_evening?: string;
  end_time_evening?: string;
}

export const storeTherapistDetails = async (
  axios: AxiosInstance,
  data: TherapistFormValues
) => {
  const formData = new FormData();

  formData.append("customer_id", data.customer_id);
  formData.append("birth_date", data.birth_date || "");
  formData.append("image", data.image || "");
  formData.append("gender", data.gender || "");
  formData.append("formatted_address", data.formatted_address || "");
  formData.append("medical_specialties_id", data.medical_specialties_id || "");
  formData.append("university_name", data.university_name || "");
  formData.append("graduation_year", data.graduation_year || "");
  formData.append("countries_certified", data.countries_certified || "");
  formData.append("experience_years", String(data.experience_years ?? ""));
  formData.append("license_number", data.license_number || "");
  formData.append("license_authority", data.license_authority || "");

  if (data.certificate_file)
    formData.append("certificate_file", data.certificate_file);
  if (data.license_file) formData.append("license_file", data.license_file);

  formData.append("bio", data.bio || "");

  if (typeof data.location_id === "number") {
    formData.append("location_id", String(data.location_id));
  }

  formData.append("country", data.country || "");
  formData.append("city", data.city || "");

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

  const response = await axios.post("/api/therapist/store", formData, {});

  return response.data;
};
