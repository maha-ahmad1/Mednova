import axios from "axios";

export interface RegistrationData {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  accountType: "patient" | "specialist" | "clinics";
}

export const registerUser = async (data: RegistrationData) => {
  const response = await axios.post("/api/register", data);
  return response.data;
};
