"use client";

import { useState } from "react";
import { AlertCircle, Loader2, LogOut, MessageCircle, XCircle } from "lucide-react";
import { signOut } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useNotificationStore } from "@/store/notificationStore";
import { useNavigationLoader } from "@/hooks/useNavigationLoader";
import { Button } from "@/components/ui/button";

const SUPPORT_WHATSAPP_NUMBER = "96892349692";

export default function RejectedProfilePage() {
  const t = useTranslations("accountRejected");
  const notifications = useNotificationStore((state) => state.notifications);
  const { push } = useNavigationLoader();
  // Local, per-button state — never the shared `isNavigating`/global flag —
  // so each action's disabled/spinner state only reflects its own click.
  const [isGoingHome, setIsGoingHome] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const rejectionNotification = notifications.find(
    (notification) => notification.type === "account_rejected",
  );
  const backendDetail = rejectionNotification?.data as
    | { reason?: string; message?: string }
    | undefined;
  // Reason is the specific cause; message is the backend's general note —
  // show whichever the backend actually provided.
  const reason = backendDetail?.reason?.trim() || backendDetail?.message?.trim();

  const whatsappHref = `https://wa.me/${SUPPORT_WHATSAPP_NUMBER}?text=${encodeURIComponent(
    t("whatsappMessage"),
  )}`;

  // Internal route transition — the only action here that should drive the
  // top NavigationProgress bar. The button only disables itself (no inline
  // spinner) so it never duplicates the bar's loading signal.
  const handleBackToHome = () => {
    setIsGoingHome(true);
    push("/");
  };

  // Non-routing action (auth API call + hard redirect outside the Next.js
  // router) — must never touch NavigationProgress. Gets its own local
  // spinner instead.
  const handleLogout = () => {
    setIsLoggingOut(true);
    signOut({ callbackUrl: "/login" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-gradient-to-l from-white to-white/90 rounded-2xl shadow-2xl border border-gray-100 p-6 sm:p-8 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-rose-500 to-rose-600 rounded-full flex items-center justify-center mx-auto shadow-lg mb-6">
            <XCircle className="w-10 h-10 text-white" />
          </div>

          <h1 className="text-2xl font-bold text-gray-800 mb-3">
            {t("title")}
          </h1>

          <p className="text-gray-600 mb-6 leading-relaxed">
            {t("description")}
          </p>

          {reason && (
            <div className="flex items-start gap-2 text-start bg-rose-50 border border-rose-200 rounded-xl p-4 mb-6">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <p className="text-sm text-rose-700">
                <span className="font-medium">{t("reasonLabel")}: </span>
                {reason}
              </p>
            </div>
          )}

          <div className="flex flex-col gap-3">
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-[#32A88D] hover:bg-[#2a8a7a] text-white rounded-xl py-3 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
            >
              <MessageCircle className="w-4 h-4" />
              {t("contactSupport")}
            </a>

            <Button
              variant="outline"
              disabled={isGoingHome}
              onClick={handleBackToHome}
              className="rounded-xl py-3 h-auto border-gray-200 text-gray-700 hover:bg-gray-50 font-medium"
            >
              {t("backToHome")}
            </Button>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="mt-6 inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-60"
          >
            {isLoggingOut ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <LogOut className="w-3.5 h-3.5" />
            )}
            {t("logout")}
          </button>
        </div>
      </div>
    </div>
  );
}
