// providers/ClientEchoWrapper.tsx
"use client";
import { useEchoNotifications } from "@/hooks/useEchoNotifications";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

export default function EchoProvider({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  const { data: session } = useSession();
  useEchoNotifications();

  useEffect(() => {
    console.log("🔍 حالة الجلسة في EchoProvider:", {
      hasSession: !!session,
      userId: session?.user?.id,
      role: session?.role,
      hasToken: !!session?.accessToken
    });
  }, [session]);

  return <>{children}</>;
}