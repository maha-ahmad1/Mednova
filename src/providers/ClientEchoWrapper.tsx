// providers/ClientEchoWrapper.tsx
"use client";
import { useEchoNotifications } from "@/hooks/useEchoNotifications";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useChatPusher } from "@/features/chat/hooks/useChatPusher";

export default function EchoProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();
  useEchoNotifications();
  // useChatPusher();
  useEffect(() => {
    console.log("🔍 حالة الجلسة في EchoProvider:", {
      hasSession: !!session,
      userId: session?.user?.id,
      role: session?.role,
      hasToken: !!session?.accessToken,
    });
  }, [session]);

  return <>{children}</>;
}
