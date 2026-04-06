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
import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { useTranslations, useLocale } from "next-intl";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { NotificationDropdown } from "@/features/notifications/components/NotificationDropdown";
import { LanguageSwitcher } from "./LanguageSwitcher";

export function Navbar({ variant = "default" }: { variant?: "default" | "landing" | "dashboard" }) {
  const { data: session } = useSession();
  const t = useTranslations("navbar");
  const locale = useLocale(); // ✅ تم نقله هنا

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center gap-4 border-b bg-card px-12">
      <Button variant="ghost" size="icon" className="md:hidden">
        <Menu className="h-5 w-5" />
      </Button>

      <div className="flex-1 flex items-center gap-4 ">
        <Logo width={80} height={80} />

        {variant !== "landing" && (
          <div className="relative w-full max-w-md">
            <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder={t("search")}
              className="w-full pr-10 text-right"
            />
          </div>
        )}
      </div>

      {session?.user && variant !== "landing" ? (
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <NotificationDropdown />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 group">
                {session.user.image ? (
                  <Image
                    src={session.user.image}
                    width={38}
                    height={38}
                    alt="User Image"
                    className="mb-1 rounded-full border-2 border-gray-300 object-cover !w-10 !h-10 cursor-pointer"
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
              className="text-right w-37 bg-white/80 backdrop-blur-lg 
               border-gray-200/60 rounded-md shadow-md p-1 translate-x-12"
            >
              <DropdownMenuItem className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100/60 text-gray-700 transition">
                <Link
                  href={`/${locale}/profile`}  // ✅
                  className="text-sm flex-1 text-right truncate block"
                >
                  {session.user.full_name}
                </Link>
                <User className="w-4 h-4 text-gray-900 shrink-0" />
              </DropdownMenuItem>

              <DropdownMenuItem className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100/60 text-gray-700 transition">
                <Link href={`/${locale}/settings`} className="text-sm w-full text-right"> {/* ✅ */}
                  {t("settings")}
                </Link>
                <Settings className="w-4 h-4 text-gray-900" />
              </DropdownMenuItem>

              <DropdownMenuItem className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100/60 text-gray-700 transition">
                <Link href={`/${locale}/help`} className="text-sm w-full text-right"> {/* ✅ */}
                  {t("help")}
                </Link>
                <HelpCircle className="w-4 h-4 text-gray-900" />
              </DropdownMenuItem>

              <div className="h-px bg-gray-200 my-1"></div>

              <DropdownMenuItem
                className="pl-5.5 flex items-center gap-2 py-2 rounded-md bg-gray-100/60 text-gray-700 transition"
                onClick={() => signOut()}
              >
                <span className="text-sm text-gray-700">{t("logout")}</span>
                <LogOut className="w-4 h-4 text-gray-900" />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <Link
            href={`/${locale}/auth/login`}  // ✅
            className="px-4 py-2 bg-[#32A88D] text-white rounded-xl hover:bg-[#289b7e] transition"
          >
            {t("login")}
          </Link>
        </div>
      )}
    </header>
  );
}