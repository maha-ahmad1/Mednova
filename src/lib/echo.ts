import Echo from "laravel-echo";
import Pusher from "pusher-js";


/* eslint-disable @typescript-eslint/no-explicit-any */
let echoInstance: any = null;
let chatEchoInstance: any = null;

// Latest token per connection; read lazily by Pusher on each channel auth request.
const currentTokens: Record<"notifications" | "chat", string> = {
  notifications: "",
  chat: "",
};

// NEXT_PUBLIC_API_URL has no "/api" suffix (staging locally, production when deployed).
const getBroadcastingAuthEndpoint = () =>
  `${(process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/+$/, "")}/api/broadcasting/auth`;



export function getEcho(token: string) {
  currentTokens.notifications = token;
  if (echoInstance) {
    console.log("🔁 إعادة استخدام اتصال Echo للإشعارات");
    return echoInstance;
  }

  console.log("🆕 إنشاء اتصال Echo جديد للإشعارات");
  return createEchoInstance(token, "notifications");
}

export function getChatEcho(token: string) {
  currentTokens.chat = token;
  if (chatEchoInstance) {
    console.log("🔁 إعادة استخدام اتصال Echo للشات");
    return chatEchoInstance;
  }

  console.log("🆕 إنشاء اتصال Echo جديد للشات");
  return createEchoInstance(token, "chat");
}

function createEchoInstance(token: string, type: "notifications" | "chat") {
  if (typeof window === "undefined") {
    console.log("⏭️ بيئة غير متصلة - تخطي إنشاء Echo");
    return null as any;
  }



  (window as any).Pusher = Pusher;

  // 🔥 إصدار مبسط بدون أنواع معقدة
  const pusherClient = new Pusher("8e0c74bbc25e86b98813", {
    cluster: "eu",
    forceTLS: true,
    channelAuthorization: {
      endpoint: getBroadcastingAuthEndpoint(),
      transport: "ajax",
      headersProvider: () => ({
        Authorization: `Bearer ${currentTokens[type]}`,
        Accept: "application/json",
      }),
    },
  });

  const instance = new Echo({
    broadcaster: "pusher",
    client: pusherClient,
  });

  if (type === "notifications") {
    echoInstance = instance;
  } else {
    chatEchoInstance = instance;
  }

  return instance;
}


export function cleanupChatEcho() {
  if (chatEchoInstance) {
    try {
      chatEchoInstance.disconnect();
      chatEchoInstance = null;
      currentTokens.chat = "";
      console.log("🧹 تم تنظيف اتصال الشات");
    } catch (error) {
      console.error("❌ خطأ في تنظيف اتصال الشات:", error);
    }
  }
}

export function cleanupAllEcho() {
  cleanupChatEcho();
  
  if (echoInstance) {
    try {
      echoInstance.disconnect();
      echoInstance = null;
      currentTokens.notifications = "";
      console.log("🧹 تم تنظيف جميع اتصالات Echo");
    } catch (error) {
      console.error("❌ خطأ في تنظيف اتصالات Echo:", error);
    }
  }
}