"use client";

import { signOut } from "next-auth/react";
import { useAxiosInstance } from "@/lib/axios/axiosInstance";

export function useAdminLogout() {
  const axiosInstance = useAxiosInstance();

  const logout = async () => {
    try {
      await axiosInstance.post("/api/control-panel/logout");
    } catch {
      // Always clear local session even if remote logout fails.
    } finally {
      await signOut({ callbackUrl: "/control-panel/login" });
    }
  };

  return { logout };
}
