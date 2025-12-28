"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { NotificationDropdown } from "@/features/notifications/components/NotificationDropdown";
import { UserMenu } from "./UserMenu";

export function AuthActions() {
  const { data: session } = useSession();

  if (!session?.user) {
    return (
      <Button
        variant="outline"
        className="border-[#32A88D] text-[#32A88D] hover:bg-[#32A88D]/10 rounded-xl px-6 py-2 transition-all duration-200"
        asChild
      >
        <Link href="/login">تسجيل دخول</Link>
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <NotificationDropdown />
      <UserMenu />
    </div>
  );
}
