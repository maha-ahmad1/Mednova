"use client";

import { Bell, CheckCircle2, FileClock, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const alerts = [
  { id: 1, icon: FileClock, text: "8 طلبات انضمام بانتظار المراجعة" },
  { id: 2, icon: ShieldAlert, text: "تنبيه أمني: تسجيل دخول جديد للوحة التحكم" },
  { id: 3, icon: CheckCircle2, text: "اكتملت تسوية المدفوعات اليومية" },
];

export function NotificationsDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative" aria-label="الإشعارات">
          <Bell className="h-5 w-5" />
          <Badge className="absolute -left-1 -top-1 h-5 min-w-5 px-1.5 text-[10px]">{alerts.length}</Badge>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel>الإشعارات</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {alerts.map((alert) => {
          const Icon = alert.icon;

          return (
            <DropdownMenuItem key={alert.id} className="items-start gap-2 py-3">
              <Icon className="mt-0.5 h-4 w-4 text-muted-foreground" />
              <p className="text-xs leading-5">{alert.text}</p>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
