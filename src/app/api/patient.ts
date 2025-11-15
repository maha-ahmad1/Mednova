import { AxiosInstance } from "axios";

export interface PatientFormValues {
  customer_id: string;
  gender: "Male" | "Female";
  birth_date?: string;
  image?: File | null;
  emergency_phone?: string;
  relationship?: string;
  city?: string;
  country?: string;
  formatted_address?: string;
}

export const storePatientDetails = async (
  axios: AxiosInstance,
  data: PatientFormValues
) => {
  const formData = new FormData();
  formData.append("customer_id", data.customer_id);
  formData.append("gender", data.gender);
  formData.append("birth_date", data.birth_date || "");
  formData.append("image", data.image || "");
  formData.append("emergency_phone", data.emergency_phone || "");
  formData.append("relationship", data.relationship || "");
  formData.append("country", data.country || "");
  formData.append("city", data.city || "");
  formData.append("formatted_address", data.formatted_address || "");

  const response = await axios.post("/api/patient/store", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};
