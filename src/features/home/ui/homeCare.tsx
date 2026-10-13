"use client";

import { ArrowRight, HeartPulse } from "lucide-react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

export default function HomeCare() {
  const t = useTranslations("kawader.home");
  const { data: session, status } = useSession();

  // Same role source as the middleware. Home-care requests are for patients, so a signed-in
  // specialist or center does not see the section (like the sidebar hides role-specific items).
  // Guests and patients do; a guest who clicks is sent to login by the existing /profile guard.
  const role = session?.role ?? session?.user?.type_account;
  if (status === "authenticated" && role !== "patient") return null;

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-white to-sky-50/40 px-4 py-16 sm:px-6 lg:px-8">
      <div
        className="absolute -top-24 -end-24 h-80 w-80 rounded-full bg-primary/10 blur-3xl"
        aria-hidden
      />

      <div className="relative z-10 mx-auto max-w-3xl text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
          <HeartPulse className="h-4 w-4" aria-hidden />
          <span>{t("badge")}</span>
        </div>

        <h2 className="mb-4 text-3xl font-extrabold leading-tight text-gray-800 md:text-4xl">
          {t("title")}
        </h2>

        <p className="mb-8 text-lg leading-relaxed text-gray-600">{t("description")}</p>

        <Button
          size="lg"
          className="w-full rounded-xl px-8 py-4 text-lg shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:w-auto"
          asChild
        >
          <Link href="/profile/kawader/new">
            {t("cta")}
            <ArrowRight className="ms-2 h-5 w-5 rtl:rotate-180" aria-hidden />
          </Link>
        </Button>
      </div>
    </section>
  );
}
