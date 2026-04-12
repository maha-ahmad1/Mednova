"use client";

import { signOut } from "next-auth/react";
import { resetDeduplicator } from "@/utils/persistentDeduplicator";
import { useAxiosInstance } from "@/lib/axios/axiosInstance";

export function useAdminLogout() {
  const axiosInstance = useAxiosInstance();

  const logout = async () => {
    try {
      await axiosInstance.post("/api/control-panel/logout");
    } catch {
      // Always clear local session even if remote logout fails.
    } finally {
      resetDeduplicator();
      await signOut({ callbackUrl: "/control-panel/login" });
    }
  };

  return { logout };
}
