"use client";

import axios from "axios";
import { useSession } from "next-auth/react";
import { useLocale } from "next-intl";

export const useAxiosInstance = () => {
  const { data: session } = useSession();
  const token = session?.accessToken;
  const locale = useLocale();
  // console.log("Token in axios instance:", token);
  return axios.create({
    baseURL: "https://api.mednovacare.com",
    headers: {
      "Accept-Language": locale,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
};
