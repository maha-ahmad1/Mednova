// src/features/service-provider/ui/components/BreadcrumbNav.tsx
import Link from "next/link";
import { HomeIcon, ArrowRight } from "lucide-react";

interface BreadcrumbNavProps {
  currentPage: string;
  homeHref?: string;
  homeText?: string;
}

export default function BreadcrumbNav({
  currentPage,
  homeHref = "/",
  homeText = "الرئيسية",
}: BreadcrumbNavProps) {
  return (
    <section className="bg-gradient-to-br from-[#32A88D]/5 via-white to-blue-50/30 py-6 px-5 md:px-16 lg:px-28">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center gap-2 text-sm text-gray-600 py-6">
          <Link
            href={homeHref}
            className="flex items-center gap-2 hover:text-[#32A88D] transition-colors"
          >
            <HomeIcon className="w-4 h-4" />
            {homeText}
          </Link>
          <ArrowRight className="w-4 h-4 rotate-180" />
          <span className="text-[#32A88D] font-medium">{currentPage}</span>
        </div>
      </div>
    </section>
  );
}