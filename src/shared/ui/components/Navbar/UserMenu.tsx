"use client";

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { signOut, useSession } from "next-auth/react";
import { useTranslations, useLocale } from "next-intl";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { User, Wallet, HelpCircle, LogOut, Calendar } from "lucide-react";
import { useProfileImageStore } from "@/store/useProfileImageStore";

export function UserMenu() {
  const t = useTranslations("sidebar");
  const tNav = useTranslations("navbar");
  const locale = useLocale();
  const dir: "rtl" | "ltr" = locale === "ar" ? "rtl" : "ltr";
  const { data: session } = useSession();
  const storeImage = useProfileImageStore((state) => state.image);

  if (!session?.user) return null;

  // Use Zustand store image (source of truth for UI), fallback to session image
  const displayImage = storeImage || session.user.image;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 cursor-pointer">
          {displayImage ? (
            <Image
              src={displayImage}
              width={40}
              height={40}
              alt="User"
              className="rounded-full border object-cover w-10 h-10"
            />
          ) : (
            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
              {session.user.name?.[0] || "U"}
            </div>
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        // align="end"
        className="text-start w-40 bg-white/80 "
      >
        <div dir={dir} className="contents">
          <DropdownMenuItem
            className="flex items-center gap-2 px-3 py-2 rounded-md
             hover:bg-gray-100/60 text-gray-700 transition"
          >
            <User className="w-4 h-4 shrink-0" />

            <Link
              href="/profile"
              className="flex-1  text-sm text-start truncate block"
            >
              {session.user.full_name}
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem className="flex gap-2">
            <Calendar className="w-4 h-4" />

            <Link
              href="/profile/consultations"
              className="flex-1 text-sm text-start"
            >
              {t("consultationRequests")}
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem className="flex gap-2">
            <Wallet className="w-4 h-4" />

            <Link
              href="/profile/financial"
              className="flex-1 text-sm text-start"
            >
              {t("financialWallet")}
            </Link>
          </DropdownMenuItem>

          <div className="h-px bg-gray-200 my-1" />

          <DropdownMenuItem
            onClick={() => signOut()}
            className="flex gap-2 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />

            <span className="flex-1 text-sm">{tNav("logout")}</span>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
