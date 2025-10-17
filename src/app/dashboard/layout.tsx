"use client";

import { Navbar } from "@/shared/ui/navbar";
import { Sidebar } from "@/features/dashboard/ui/sidebar";
import { cn } from "@/lib/utils";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-50" dir="rtl">
      <Sidebar />

      <div className={cn("flex-1 flex flex-col")}>
        <Navbar/>

        <main className="flex-1 container mx-auto px-6 py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
