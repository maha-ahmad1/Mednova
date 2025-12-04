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
<div className="min-h-screen bg-gray-50" dir="rtl">
  {/* النافبار */}
  {!isCreatePage && !isPendingPage && <Navbar />}
  
  <div className="flex">
    {/* السايدبار */}
    {!isCreatePage && !isPendingPage && (
      <div className="fixed bottom-0 left-0 right-0 lg:fixed lg:right-10 lg:top-36 h-16 lg:h-auto lg:w-70 z-40 lg:z-30 bg-white border-t lg:border lg:border-gray-100 lg:rounded-2xl shadow-lg lg:shadow-xl overflow-hidden">
        <Sidebar />
      </div>
    )}
    
    {/* المحتوى الرئيسي */}
    <div className={cn(
      "flex-1 min-h-screen transition-all duration-300 w-full",
      !isCreatePage && !isPendingPage && "pb-20 lg:pb-0 lg:mr-80"
    )}>
      <main className="container mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  </div>
</div>
  );
}
