"use client";

import axios from "axios";
import { useMemo } from "react";
import { getSession, signOut, useSession } from "next-auth/react";
import { useLocale } from "next-intl";

const baseURL = process.env.NEXT_PUBLIC_API_URL;
if (!baseURL) {
  throw new Error("NEXT_PUBLIC_API_URL is not defined");
}

export const useAxiosInstance = () => {
  const { data: session } = useSession();
  const token = session?.accessToken;
  const locale = useLocale();

  return useMemo(() => {
    const instance = axios.create({
      baseURL,
      headers: {
        "Accept-Language": locale,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    instance.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error?.response?.status === 401) {
          const originalRequest = error.config;
          const currentSession = await getSession();

          if (currentSession?.accessToken && !originalRequest._retry) {
            originalRequest._retry = true;
            originalRequest.headers = {
              ...originalRequest.headers,
              Authorization: `Bearer ${currentSession.accessToken}`,
            };
            return instance(originalRequest);
          }

          signOut({ callbackUrl: "/login" });
        }
        return Promise.reject(error);
      },
    );

    return instance;
  }, [token, locale]);
};
