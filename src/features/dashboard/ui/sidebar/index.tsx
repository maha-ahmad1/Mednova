"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { sidebarMenus } from "@/constants/sidebar-menu";
import { LogOut } from "lucide-react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { SidebarSkeleton } from "./SidebarSkeleton";
const userRole: keyof typeof sidebarMenus = "patient";

export function Sidebar() {
  const pathname = usePathname();
  const menuItems = sidebarMenus[userRole];
  const { data: session,status } = useSession();
  
if (status === "loading") {
  return (
    <aside className="fixed right-10 top-30 z-40 w-72 bg-white shadow-xl border border-gray-100 rounded-2xl overflow-hidden">
      <div className="flex flex-col items-center p-6 bg-[#32A88D]/10 border-b border-gray-100 animate-pulse">
        <div className="w-20 h-20 rounded-full bg-gray-200 mb-3" />

        <div className="h-4 w-32 bg-gray-200 rounded mb-2" />

        <div className="h-3 w-28 bg-gray-200 rounded" />
      </div>

      <nav className="flex flex-col gap-2 p-4 bg-white animate-pulse">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-10 bg-gray-200 rounded-xl" />
        ))}
      </nav>

      <div className="border-t border-gray-100 p-4 animate-pulse">
        <div className="h-8 bg-gray-200 rounded-xl" />
      </div>
    </aside>
  );
}

  const user = {
    name: session?.user?.full_name || "اسم المستخدم",
    email: session?.user?.email || "email@example.com",
    image: session?.user?.image || "/images/placeholder.svg",
  };
  console.log("Session image:", session?.user?.image);

  return (
    <aside className=" fixed right-10 top-30 z-40 w-72 bg-white shadow-xl border border-gray-100 rounded-2xl overflow-hidden transition-all duration-300 ">
      <div className="flex flex-col items-center p-6 bg-[#32A88D]/10 border-b border-gray-100 ">
        <div className="relative">
          <Image
            src={user.image}
            alt="User avatar"
            width={80}
            height={80}
            className="rounded-full border-2 border-[#32A88D] shadow-sm"
          />
          <button
            className="absolute bottom-0 right-0 bg-[#32A88D] text-white text-xs rounded-full p-1 hover:bg-[#2b8e77]"
            title="تغيير الصورة"
          >
            ✎
          </button>
        </div>
        <h3 className="mt-3 text-lg font-semibold text-gray-800">
          {user.name}
        </h3>
        <p className="text-sm text-gray-500">{user.email}</p>
      </div>

      <nav className="flex flex-col gap-1 p-4 bg-white">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-[#32A88D] text-white shadow-md"
                  : "text-gray-600 hover:bg-[#32A88D]/10 hover:text-[#32A88D]"
              )}
            >
              <item.icon
                className={cn(
                  "h-5 w-5",
                  isActive ? "text-white" : "text-[#32A88D]"
                )}
              />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* 🔹 تسجيل الخروج */}
      <div className="border-t border-gray-100 p-4">
        <button
          type="button"
          className="flex items-center gap-3 text-sm text-gray-500 hover:text-red-500 transition-all w-full"
          title="تسجيل الخروج"
        >
          <LogOut className="w-4 h-4" />
          <span>تسجيل الخروج</span>
        </button>
      </div>
    </aside>
  );
}
