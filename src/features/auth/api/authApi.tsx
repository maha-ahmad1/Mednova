import axios from "axios";

export interface RegistrationData {
  full_name: string;  
  email: string;
  phone: string;
  password: string;
  password_confirmation: string; 
  type_account: string;  
}
export interface LoginData {
  email: string;
  password: string;
}

const api = axios.create({
  baseURL: "https://demoapplication.jawebhom.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});


export const registerUser = async (data: RegistrationData) => {
  const response = await api.post(
    "/auth/register",
    data,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};


export const loginUser = async (data: LoginData) => {
  const response = await api.post("/auth/login", data, {
    headers: { "Content-Type": "application/json" },
  });
  return response.data;
};


export const forgotPassword = async (data: { email: string; verification_method: string }) => {
  const response = await api.post("/auth/forgot-password", data, {
    headers: { "Content-Type": "application/json" },
  });
  return response.data;
};


export const verifyToken = async (data: { email: string; token: string; verification_method: string }) => {
  const response = await api.post("/auth/verifyToken", data, {
   headers: {
    "Content-Type": "application/json; charset=utf-8",
    "Accept": "application/json",
  },
  transformRequest: [(data) => {
    // Ensure data is properly encoded
    return JSON.stringify(data);
  }],
  });
  return response.data;
};