// 'use client';

// import axios from 'axios';
// import { useSession } from 'next-auth/react';

// export const useAxiosInstance = () => {
//   const { data: session } = useSession();

//   const token = session?.accessToken;

//   return axios.create({
//     baseURL: 'https://mednovacare.com',
//     headers: {
//       'Content-Type': 'application/json',
//       Authorization: token ? `Bearer ${token}` : '',
//     },
//   });
// };

"use client";

import axios from "axios";
import { useSession } from "next-auth/react";

export const useAxiosInstance = () => {
  const { data: session } = useSession();
  const token = session?.accessToken;
  // console.log("Token in axios instance:", token);
  return axios.create({
    baseURL: "https://mednovacare.com",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
};
