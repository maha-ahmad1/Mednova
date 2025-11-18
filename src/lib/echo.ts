// lib/echo.ts
import Echo from "laravel-echo";
import Pusher from "pusher-js";
import { setupPusherListeners } from "@/utils/echo-helpers";

// تعريف الأنواع المطلوبة
declare global {
  interface Window {
    Pusher: typeof Pusher;
  }
}

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
  enabledTransports?: ('ws' | 'wss')[];
  disabledTransports?: ('sockjs' | 'xhr_polling' | 'xhr_streaming')[];
}

// أنواع لـ Pusher Connector
interface PusherConnection {
  state: string;
  bind: (event: string, callback: (error?: unknown) => void) => void;
}

interface PusherConnectorOptions {
  auth: {
    headers: {
      Authorization: string;
    };
  };
}

interface PusherConnector {
  pusher: {
    connection: PusherConnection;
  };
  options: PusherConnectorOptions;
}

// نوع مخصص لـ Echo مع معرفة Connector
// @ts-expect-error: Echo generic parameter not required for our limited usage
type CustomEcho = Echo & {
  connector: PusherConnector;
};

let echoInstance: CustomEcho | null = null;

/**
 * دالة لإنشاء Echo instance لكل مستخدم بالتوكن الخاص به
 */
export const createEcho = (accessToken: string): CustomEcho => {
  // إذا كان هناك instance نشط، أرجعها
  if (
    echoInstance && 
    echoInstance.connector.pusher.connection.state === 'connected' &&
    echoInstance.connector.options.auth.headers.Authorization === `Bearer ${accessToken}`
  ) {
    console.log("🔁 إعادة استخدام اتصال Echo موجود");
    return echoInstance;
  }
  
  // إذا كان هناك instance قديم بتوكن مختلف، افصله
  if (
    echoInstance && 
    echoInstance.connector.options.auth.headers.Authorization !== `Bearer ${accessToken}`
  ) {
    console.log("🔄 تغيير التوكن، فصل الاتصال القديم");
    echoInstance.disconnect();
    echoInstance = null;
  }
  
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

  // إنشاء instance جديدة مع النوع الصحيح
  echoInstance = new Echo(config) as CustomEcho;

  // طريقة آمنة للوصول إلى اتصال Pusher
  setTimeout(() => {
    try {
      const pusher = echoInstance!.connector.pusher;
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

  setupPusherListeners(echoInstance);
  return echoInstance;
};

// دالة لتنظيف الـ instance
export const cleanupEcho = (): void => {
  if (echoInstance) {
    echoInstance.disconnect();
    echoInstance = null;
    console.log("🧹 تم تنظيف Echo instance");
  }
};