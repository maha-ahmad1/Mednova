"use client";

import { Link } from "@/i18n/navigation";
import { MessageCircle } from "lucide-react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { NotificationDropdown } from "@/features/notifications/components/NotificationDropdown";
import { UserMenu } from "./UserMenu";

interface AuthActionsProps {
  variant?: "landing" | "dashboard";
}

export function AuthActions({ variant = "landing" }: AuthActionsProps) {
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
    <div className="flex items-center gap-1 sm:gap-2 lg:gap-4">
      {/* On landing, chat is reachable from UserMenu on mobile instead — there's no bottom nav to fall back on there. */}
      <Button
        variant="ghost"
        size="icon"
        asChild
        className={variant === "landing" ? "hidden lg:inline-flex" : undefined}
      >
        <Link href="/profile/chat" aria-label={t("chat")}>
          <MessageCircle className="h-5 w-5" />
        </Link>
      </Button>
      <NotificationDropdown />
      <UserMenu />
    </div>
  );
}
