"use client";

import Link from "next/link";
import { ChevronDown, LogOut, Settings, UserCircle2 } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAdminLogout } from "@/features/control-panel/admin-auth/hooks/useAdminLogout";

export function ProfileDropdown() {
  const { logout } = useAdminLogout();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="gap-2 px-2">
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
          <span className="hidden text-sm sm:inline">مدير النظام</span>
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary/10 text-primary">AD</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56 text-right">
        <DropdownMenuItem asChild>
          <Link href="/profile" className="flex flex-row-reverse items-center justify-end gap-2 text-right">
            <UserCircle2 className="h-4 w-4" />
            ملفي الشخصي
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            href="/coming-soon"
            className="flex flex-row-reverse items-center justify-end gap-2 text-right"
          >
            <Settings className="h-4 w-4" />
            الإعدادات
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={logout}
          className="flex flex-row-reverse items-center justify-end gap-2 text-right text-destructive focus:text-destructive"
        >
          <LogOut className="h-4 w-4" />
          تسجيل الخروج
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
