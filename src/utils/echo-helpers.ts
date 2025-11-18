// utils/echo-helpers.ts
import Echo from "laravel-echo";
import type { PusherConnector } from "@/types/echo";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const setupPusherListeners = (echo: Echo<any>): void => {
  // استخدام أي للوصول إلى الخصائص الداخلية مؤقتاً
  const connector = echo.connector as unknown as PusherConnector;
  
  if (connector.pusher && connector.pusher.connection) {
    const connection = connector.pusher.connection;
    
    connection.bind('connected', () => {
      console.log('✅ Pusher متصل بنجاح');
    });

    connection.bind('disconnected', () => {
      console.log('❌ Pusher تم قطع الاتصال');
    });

    connection.bind('error', (error: unknown) => {
      console.error('❌ خطأ في اتصال Pusher:', error);
    });

    connection.bind('connecting', () => {
      console.log('🔄 جاري الاتصال بـ Pusher...');
    });
  }
};