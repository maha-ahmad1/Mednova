"use client";

import { Navbar } from "@/shared/ui/navbar";
import { Sidebar } from "@/features/profile/_create/ui/sidebar";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isCreatePage = pathname.includes("/create");
  const isPendingPage = pathname.includes("/pending");

  return (
    <div className="flex min-h-screen bg-gray-50" dir="rtl">
{!isCreatePage && !isPendingPage && <Sidebar />}
      <div className={cn("flex-1 flex flex-col")}>
        <Navbar />

        <main className="flex-1 container mx-auto px-6 py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
