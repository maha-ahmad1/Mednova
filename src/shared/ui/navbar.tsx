"use client";

import { Bell, Search, Menu } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Logo } from "./Logo";

export function Navbar() {
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

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-destructive text-[10px]">
            3
          </Badge>
        </Button>
      </div>
    </header>
  );
}
