import Link from "next/link";
import { useTranslations } from "next-intl";
import { AlertCircle, ArrowLeft } from "lucide-react";

export default function NotFound() {
  const t = useTranslations("common");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#F7FBFA] via-white to-[#EEF8F5] px-6">
      <div className="w-full max-w-xl text-center rounded-3xl border border-[#D6ECE6] bg-white/90 shadow-[0_10px_40px_rgba(50,168,141,0.12)] p-8 md:p-12">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#32A88D]/10">
          <AlertCircle className="h-10 w-10 text-[#32A88D]" />
        </div>

        <span className="inline-block rounded-full bg-[#32A88D]/10 px-4 py-1 text-sm font-medium text-[#32A88D] mb-4">
          404 Error
        </span>

        <h1 className="text-3xl md:text-4xl font-bold text-[#1F2A37] mb-4">
          {t("pageNotFound") || "404 - Page Not Found"}
        </h1>

        <p className="text-[#6B7280] text-base md:text-lg leading-7 mb-8">
          {t("pageNotFoundDesc") ||
            "The page you're looking for doesn't exist or may have been moved."}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#32A88D] px-6 py-3 text-white font-medium transition hover:bg-[#2b927a] shadow-md hover:shadow-lg"
          >
            <ArrowLeft className="h-4 w-4" />
            {t("goHome") || "Go Home"}
          </Link>
        </div>
      </div>
    </div>
  );
}