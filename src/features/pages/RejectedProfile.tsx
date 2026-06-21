"use client";

import { LogOut, MessageCircle, XCircle } from "lucide-react";
import { signOut } from "next-auth/react";
import { useTranslations } from "next-intl";

const SUPPORT_WHATSAPP_NUMBER = "96892349692";

export default function RejectedProfilePage() {
  const t = useTranslations("accountRejected");

  const whatsappHref = `https://wa.me/${SUPPORT_WHATSAPP_NUMBER}?text=${encodeURIComponent(
    t("whatsappMessage"),
  )}`;

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="max-w-md w-full">
        <div className="bg-gradient-to-l from-white to-white/90 rounded-2xl shadow-2xl border border-gray-100 p-8 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-rose-500 to-rose-600 rounded-full flex items-center justify-center mx-auto shadow-lg mb-6">
            <XCircle className="w-10 h-10 text-white" />
          </div>

          <h1 className="text-2xl font-bold text-gray-800 mb-3">
            {t("title")}
          </h1>

          <p className="text-gray-600 mb-6 leading-relaxed">
            {t("description")}
          </p>

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

            <button
              type="button"
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="flex items-center justify-center gap-2 border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl py-3 transition-all duration-200 font-medium"
            >
              <LogOut className="w-4 h-4" />
              {t("logout")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
