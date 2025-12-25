"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DropdownMenuSeparator } from "@/components/ui/dropdown-menu";

export interface NotificationFooterProps {
  totalCount: number;
}

export function NotificationFooter({ totalCount }: NotificationFooterProps) {
  return (
    <>
      <DropdownMenuSeparator />
      <div className="p-2">
        <Link href="/notifications" className="w-full">
          <Button variant="ghost" className="w-full">
            عرض جميع الإشعارات ({totalCount})
          </Button>
        </Link>
      </div>
    </>
  );
}