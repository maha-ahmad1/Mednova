"use client";

import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { NotificationDropdown } from "@/features/notifications/components/NotificationDropdown";
import { UserMenu } from "./UserMenu";

export function AuthActions() {
  const { data: session } = useSession();
  const t = useTranslations("navbar");

  if (!session?.user) {
    return (
      <Button
        variant="outline"
        className="border-[#32A88D] text-[#32A88D] hover:bg-[#32A88D]/10 rounded-xl px-6 py-2 transition-all duration-200"
        asChild
      >
        <Link href="/login">{t("login")}</Link>
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="icon" asChild>
        <Link href="/profile/chat" aria-label="المحادثات">
          <MessageCircle className="h-5 w-5" />
        </Link>
      </Button>
      <NotificationDropdown />
      <UserMenu />
    </div>
  );
}
