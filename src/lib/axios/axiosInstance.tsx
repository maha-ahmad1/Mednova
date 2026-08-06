"use client";

import axios from "axios";
import { useMemo } from "react";
import { signOut, useSession } from "next-auth/react";
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
      (error) => {
        if (error?.response?.status === 401) {
          signOut({ callbackUrl: "/login" });
        }
        return Promise.reject(error);
      },
    );

    return instance;
  }, [token, locale]);
};
