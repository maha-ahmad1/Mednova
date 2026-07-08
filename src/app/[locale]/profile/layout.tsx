"use client";

import { Sidebar } from "@/features/profile/_create/ui/sidebar";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import Navbar from "@/shared/ui/components/Navbar/Navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const locale = useLocale();
  const dir = locale === "ar" ? "rtl" : "ltr";

  const isCreatePage = pathname.includes("/create");
  const isPendingPage = pathname.includes("/pending");
  const isRejectedPage = pathname.includes("/rejected");
  const hideChrome = isCreatePage || isPendingPage || isRejectedPage;

  return (
    <div className="min-h-screen bg-gray-50" dir={dir}>
      {!hideChrome && <Navbar variant="dashboard" />}

      <div className="flex">
        {!hideChrome && (
          <div
            className="   fixed bottom-0 start-0 end-0 h-16
    lg:top-36 lg:bottom-auto lg:start-10 lg:end-auto lg:h-auto lg:w-70
    z-40 lg:z-30
    bg-white border-t lg:border lg:border-gray-100
    lg:rounded-2xl shadow-lg lg:shadow-xl
    overflow-hidden"
          >
            <Sidebar />
          </div>
        )}

        {/* المحتوى الرئيسي */}
        <div
          className={cn(
            "flex-1 min-h-screen transition-all duration-300 w-full",
            !hideChrome && "pb-20 lg:pb-0 lg:ms-80"
          )}
        >
          <main className="container mx-auto px-6 py-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
