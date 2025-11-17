"use client";

import {
  Bell,
  Search,
  Menu,
  User,
  LogOut,
  Settings,
  HelpCircle,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Logo } from "./Logo";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

export function Navbar() {
  const { data: session } = useSession();
  return (
    <header className="sticky top-0 z-30 flex h-20 items-center gap-4 border-b bg-card px-12">
      <Button variant="ghost" size="icon" className="md:hidden">
        <Menu className="h-5 w-5" />
      </Button>

      <div className="flex-1 flex items-center gap-4 " dir="rtl">
        <Logo width={80} height={80} />

        <div className="relative w-full max-w-md">
          <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="ابحث عن مستخدم، موعد، أو تقرير..."
            className="w-full pr-10 text-right"
            dir="rtl"
          />
        </div>
      </div>

      {session?.user ? (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-destructive text-[10px]">
              3
            </Badge>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 group">
                {session.user.image ? (
                  <Image
                    src={session.user.image}
                    width={38}
                    height={38}
                    alt="User Image"
                    className="mb-1 rounded-full border-2 border-gray-300 object-cover !w-10 !h-10  cursor-pointer"
                  />
                ) : (
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 font-semibold cursor-pointer">
                    {session.user.name?.[0] || "U"}
                  </div>
                )}
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              sideOffset={0}
              className=" text-right w-37 bg-white/80 backdrop-blur-lg 
               border-gray-200/60 rounded-md shadow-md p-1   translate-x-12"
            >
              <DropdownMenuItem
                className="flex items-center gap-2 px-3 py-2 rounded-md 
                 hover:bg-gray-100/60 text-gray-700 transition "
              >
                <Link href="/profile" className="text-sm w-full text-right">
                  {session.user.full_name}
                </Link>
                <User className="w-4 h-4 text-gray-900" />
              </DropdownMenuItem>
              <DropdownMenuItem
                className="flex items-center gap-2 px-3 py-2 rounded-md 
               hover:bg-gray-100/60 text-gray-700 transition "
              >
                <Link href="/settings" className="text-sm w-full text-right">
                  الإعدادات
                </Link>
                <Settings className="w-4 h-4 text-gray-900" />
              </DropdownMenuItem>
              <DropdownMenuItem
                className="flex items-center gap-2 px-3 py-2 rounded-md
               hover:bg-gray-100/60 text-gray-700 transition"
              >
                <Link href="/help" className="text-sm w-full text-right">
                  المساعدة
                </Link>
                <HelpCircle className="w-4 h-4 text-gray-900" />
              </DropdownMenuItem>
              <div className="h-px bg-gray-200 my-1"></div>
              <DropdownMenuItem
                className="pl-5.5 flex items-center gap-2  py-2 rounded-md
               bg-gray-100/60 text-gray-700 transition"
                onClick={() => signOut()}
              >
                <span className="text-sm text-gray-700">تسجيل الخروج</span>
                <LogOut className="w-4 h-4 text-gray-900" />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ) : (
        <Link
          href="/auth/login"
          className="px-4 py-2 bg-[#32A88D] text-white rounded-xl hover:bg-[#289b7e] transition"
        >
          تسجيل دخول
        </Link>
      )}
    </header>
  );
}

{
  /* <DropdownMenuContent
              align="end"
              dir="rtl"
              className="w-36 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-2xl p-2"
            >
              <DropdownMenuItem className=" flex items-start px-3 py-3 rounded-xl  hover:bg-[#32A88D]/10 hover:text-[#32A88D] cursor-pointer transition-all duration-200">
                <User className="w-4 h-4 text-[#32A88D] font-medium" />

                <Link
                  href="/profile"
                  className=" text-start w-full text-sm font-medium"
                >
                  {session.user.full_name}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className=" flex items-start gap-3 px-3 py-3 rounded-xl  hover:bg-[#32A88D]/10 hover:text-[#32A88D] cursor-pointer transition-all duration-200">
                <Settings className="w-4 h-4 text-[#32A88D] font-medium" />

                <Link
                  href="/profile"
                  className="text-start w-full text-sm font-medium"
                >
                  إعدادات
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className=" flex items-center gap-3 px-3 py-3 rounded-xl  hover:bg-[#32A88D]/10 hover:text-[#32A88D] cursor-pointer transition-all duration-200">
                <HelpCircle className="w-4 h-4 text-[#32A88D] font-medium" />

                <Link href="/profile" className="w-full text-sm font-medium">
                  مساعدة
                </Link>
              </DropdownMenuItem>
              <div className="my-1 border-t border-gray-200" />
              <DropdownMenuItem
                className=" flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-red-200 text-red-600 cursor-pointer transition-all duration-200"
                onClick={() => signOut()}
              >
                <LogOut className="w-4 h-4" />

                <span className="text-sm font-medium">تسجيل خروج</span>
              </DropdownMenuItem>
            </DropdownMenuContent> */
}
