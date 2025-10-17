import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ResetPasswordState {
  email: string;
  token: string;
  verification_method: string;
  setEmail: (email: string) => void;
  setToken: (token: string) => void;
  setVerificationMethod: (method: string) => void;
  resetAll: () => void;
}

export const useResetPasswordStore = create(
  persist<ResetPasswordState>(
    (set) => ({
      email: "",
      token: "",
      verification_method: "email",
      setEmail: (email) => set({ email }),
      setToken: (token) => set({ token }),
      setVerificationMethod: (method) => set({ verification_method: method }),
      resetAll: () => set({ email: "", token: "", verification_method: "email" }),
    }),
    {
      name: "reset-password-store",
      storage: {
        getItem: (name) => {
          const value = sessionStorage.getItem(name);
          return value ? JSON.parse(value) : null;
        },
        setItem: (name, value) => sessionStorage.setItem(name, JSON.stringify(value)),
        removeItem: (name) => sessionStorage.removeItem(name),
      },
    }
  )
);


// const { user } = useAuthStore();
// const userRole = user?.role || "admin";
