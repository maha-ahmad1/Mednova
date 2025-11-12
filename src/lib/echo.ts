// lib/echo.ts
import Echo from "laravel-echo";
import Pusher from "pusher-js";
import { setupPusherListeners } from "@/utils/echo-helpers";
import type { EchoConnector } from "@/types/echo";


// تعريف نوع لـ window مع Pusher

// نوع مخصص للإعدادات
interface EchoConfig {
  broadcaster: 'pusher';
  key: string;
  cluster: string;
  forceTLS: boolean;
  authEndpoint: string;
  auth: {
    headers: {
      Authorization: string;
      Accept: string;
    };
  };
  enabledTransports?: string[];
  disabledTransports?: string[];
}

/**
 * دالة لإنشاء Echo instance لكل مستخدم بالتوكن الخاص به
 */
export const createEcho = (accessToken: string): Echo => {
  console.log("🔑 إنشاء Echo بالتوكن:", accessToken ? "موجود" : "مفقود");
  
  const config: EchoConfig = {
    broadcaster: 'pusher',
    key: "8e0c74bbc25e86b98813",
    cluster: "eu",
    forceTLS: true,
    authEndpoint: "https://demoapplication.jawebhom.com/api/broadcasting/auth",
    auth: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
    },
    enabledTransports: ['ws', 'wss'],
    disabledTransports: ['sockjs', 'xhr_polling'],
  };

  // تفعيل التصحيح في وضع التطوير
  if (process.env.NODE_ENV === 'development') {
    Pusher.logToConsole = true;
  }

  const echo = new Echo(config);

  // طريقة آمنة للوصول إلى اتصال Pusher
  setTimeout(() => {
    try {
      // التحقق من اتصال Pusher بعد فترة قصيرة
      const pusher = (echo.connector as any).pusher;
      if (pusher && pusher.connection) {
        pusher.connection.bind('connected', () => {
          console.log('✅ Pusher متصل بنجاح');
        });

        pusher.connection.bind('disconnected', () => {
          console.log('❌ Pusher تم قطع الاتصال');
        });

        pusher.connection.bind('error', (error: unknown) => {
          console.error('❌ خطأ في اتصال Pusher:', error);
        });
      }
    } catch (error) {
      console.warn('⚠️ لا يمكن الوصول إلى اتصال Pusher:', error);
    }
  }, 1000);
setupPusherListeners(echo);
  return echo;
};