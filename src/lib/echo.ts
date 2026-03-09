import Echo from "laravel-echo";
import Pusher from "pusher-js";


/* eslint-disable @typescript-eslint/no-explicit-any */
let echoInstance: any = null;
let chatEchoInstance: any = null;
let notificationsToken: string | null = null;
let chatToken: string | null = null;

export function getEcho(token: string) {
  if (echoInstance && notificationsToken !== token) {
    cleanupAllEcho();
  }

  if (echoInstance) {
    console.log("🔁 إعادة استخدام اتصال Echo للإشعارات");
    return echoInstance;
  }

  console.log("🆕 إنشاء اتصال Echo جديد للإشعارات");
  return createEchoInstance(token, "notifications");
}

export function getChatEcho(token: string) {
  if (chatEchoInstance && chatToken !== token) {
    cleanupChatEcho();
  }

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
    authEndpoint: "https://api.mednovacare.com/api/broadcasting/auth",
    auth: {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    },
  });

  const instance = new Echo({
    broadcaster: "pusher",
    client: pusherClient,
  });

  if (type === "notifications") {
    echoInstance = instance;
    notificationsToken = token;
  } else {
    chatEchoInstance = instance;
    chatToken = token;
  }

  return instance;
}


export function cleanupChatEcho() {
  if (chatEchoInstance) {
    try {
      chatEchoInstance.disconnect();
      chatEchoInstance = null;
      chatToken = null;
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
      notificationsToken = null;
      console.log("🧹 تم تنظيف جميع اتصالات Echo");
    } catch (error) {
      console.error("❌ خطأ في تنظيف اتصالات Echo:", error);
    }
  }
}
