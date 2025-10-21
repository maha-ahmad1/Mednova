// 'use client'

// import axios from 'axios'
//  //import { useSession } from 'next-auth/react' 

// export const useAxiosInstance = () => {
// //   const locale = useLocale()
//   return axios.create({
//     baseURL: 'https://demoapplication.jawebhom.com/api',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//   })
// }

// export const usePrivateAxiosInstance = () => {
// //  const { data: session } = useSession()
// //   const locale = useLocale()

//   return axios.create({
//     baseURL: 'https://demoapplication.jawebhom.com/api',
//     headers: {
//       'Content-Type': 'application/json',
//     //   'Accept-Language': locale === 'ar' ? 'ar' : 'en',
//     //   Authorization: `Bearer ${session?.accessToken}`,
//     },
//   })
// }
'use client';

import axios from 'axios';
import { useSession } from 'next-auth/react';

export const useAxiosInstance = () => {
  const { data: session } = useSession();

  const token = session?.accessToken;

  return axios.create({
    baseURL: 'https://demoapplication.jawebhom.com',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
    },
  });
};

