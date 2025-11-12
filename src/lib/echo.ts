// lib/echo.ts
import Echo from "laravel-echo";
import Pusher from "pusher-js";

if (typeof window !== "undefined") {
  window.Pusher = Pusher;
}

/**
 * دالة لإنشاء Echo instance لكل مستخدم بالتوكن الخاص به
 */
export const createEcho = (accessToken: string) => {
  return new Echo({
    broadcaster: "pusher",
    key: "8e0c74bbc25e86b98813", // استبدلي بالمفتاح الحقيقي
    cluster: "eu",
    // key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY!,
    // cluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER!,
     forceTLS: true,
    // authEndpoint: "https://demoapplication.jawebhom.com/broadcasting/auth",
    // auth: {
    //   headers: {
    //     Authorization: `Bearer ${accessToken}`,
    //   },
    // },
  });
};
