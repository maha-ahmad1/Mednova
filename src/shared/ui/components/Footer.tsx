"use client";

import { Link } from "@/i18n/navigation";
import {
  Phone,
  Mail,
  MapPin,
  Twitter,
  Linkedin,
  Instagram,
} from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";

export function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="relative bg-gradient-to-br from-[#32A88D]/10 via-white to-blue-50/30 border-t border-gray-200 mt-auto overflow-hidden">
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#32A88D]/5 rounded-full -translate-x-1/2 translate-y-1/2 blur-3xl"></div>
      <div className="absolute top-0 right-0 w-80 h-80 bg-blue-200/10 rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl"></div>

      <div className="relative z-10 container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <Image
                src="/images/auth/mednova-logo.png"
                alt={t("logoAlt")}
                width={120}
                height={50}
                className="object-contain "
              />
            </div>
            <p className="text-gray-600 leading-relaxed max-w-md">
              {t("tagline")}
            </p>

            <div className="space-y-3 mt-6">
              <div className="flex items-center gap-3 text-gray-600">
                <Phone className="h-4 w-4 text-[#32A88D]" />
                <span className="text-sm ltr">+968 9234 9692</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <Mail className="h-4 w-4 text-[#32A88D]" />
                <span className="text-sm">info@mednovacare.com</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <MapPin className="h-4 w-4 text-[#32A88D]" />
                <span className="text-sm">{t("location")}</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <h3 className="font-bold text-gray-800 mb-4 text-lg">
              {t("quickLinks")}
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/"
                  className="text-gray-600 hover:text-[#32A88D] transition-all duration-200 hover:ps-2 block"
                >
                  {t("linkHome")}
                </Link>
              </li>
              <li>
                <Link
                  href="/specialists"
                  className="text-gray-600 hover:text-[#32A88D] transition-all duration-200 hover:ps-2 block"
                >
                  {t("linkSpecialists")}
                </Link>
              </li>
              <li>
                <Link
                  href="/programs"
                  className="text-gray-600 hover:text-[#32A88D] transition-all duration-200 hover:ps-2 block"
                >
                  {t("linkPrograms")}
                </Link>
              </li>
              <li>
                <Link
                  href="/smartgloves"
                  className="text-gray-600 hover:text-[#32A88D] transition-all duration-200 hover:ps-2 block"
                >
                  {t("linkSmartGlove")}
                </Link>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-1">
            <h3 className="font-bold text-gray-800 mb-4 text-lg">
              {t("support")}
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://wa.me/96892349692"
                  className="text-gray-600 hover:text-[#32A88D] transition-all duration-200 hover:ps-2 block"
                >
                  {t("contactUs")}
                </Link>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-1">
            <h3 className="font-bold text-gray-800 mb-4 text-lg">
              {t("legal")}
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/termsandconditions"
                  className="text-gray-600 hover:text-[#32A88D] transition-all duration-200 hover:ps-2 block"
                >
                  {t("terms")}
                </Link>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-1">
            <h3 className="font-bold text-gray-800 mb-4 text-lg">
              {t("followUs")}
            </h3>
            <div className="flex gap-3 mb-6">
              <a
                href="https://wa.me/96892349692"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-[#25D366] hover:bg-[#1ebe57] rounded-xl flex items-center justify-center transition-all duration-200 transform hover:-translate-y-1"
              >
                <Phone className="h-5 w-5 text-white" />
              </a>

              <a
                href="https://x.com/mednova_om?s=11"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-[#1DA1F2] hover:bg-[#0d8ddb] rounded-xl flex items-center justify-center transition-all duration-200 transform hover:-translate-y-1"
              >
                <Twitter className="h-5 w-5 text-white" />
              </a>

              <a
                href="https://www.linkedin.com/in/mednova-oman-1242a937b/?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-[#0077B5] hover:bg-[#005983] rounded-xl flex items-center justify-center transition-all duration-200 transform hover:-translate-y-1"
              >
                <Linkedin className="h-5 w-5 text-white" />
              </a>

              <a
                href="https://www.instagram.com/mednova.om/?hl=en"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gradient-to-tr from-[#feda75] via-[#fa7e1e] to-[#d62976] rounded-xl flex items-center justify-center transition-all duration-200 transform hover:-translate-y-1"
              >
                <Instagram className="h-5 w-5 text-white" />
              </a>
            </div>

            <Link
              target="_blank"
              rel="noopener noreferrer"
              href="https://wa.me/96892349692"
            >
              <button
                type="button"
                className="cursor-pointer w-full bg-gradient-to-r from-[#32A88D] to-[#2a8a7a] hover:from-[#2a8a7a] hover:to-[#32A88D] text-white rounded-xl py-3 px-4 text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                {t("ctaContact")}
              </button>
            </Link>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 text-center">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-600 text-sm">{t("copyright")}</p>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <div className="w-2 h-2 bg-[#32A88D] rounded-full animate-pulse"></div>
              <span>{t("availability")}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
