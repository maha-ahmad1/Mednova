"use client";

import Image from "next/image";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { User, Settings, HelpCircle, LogOut } from "lucide-react";
import { useProfileImageStore } from "@/store/useProfileImageStore";

export function UserMenu() {
  const { data: session } = useSession();
  const storeImage = useProfileImageStore((state) => state.image);
  
  if (!session?.user) return null;

  // Use Zustand store image (source of truth for UI), fallback to session image
  const displayImage = storeImage || session.user.image;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2">
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
        align="end"
        className="text-right w-40 bg-white/80 backdrop-blur-lg p-1 ml-6"
      >
        <DropdownMenuItem
          className="flex items-center gap-2 px-3 py-2 rounded-md 
             hover:bg-gray-100/60 text-gray-700 transition"
        >
          <Link
            href="/profile"
            className="flex-1  text-sm text-right truncate block"
          >
            {session.user.full_name}
          </Link>
          <User className="w-4 h-4 shrink-0" />
        </DropdownMenuItem>

        <DropdownMenuItem className="flex gap-2">
          <Link href="/settings" className="flex-1 text-sm text-right">
            الإعدادات
          </Link>
          <Settings className="w-4 h-4" />
        </DropdownMenuItem>

        <DropdownMenuItem className="flex gap-2">
          <Link href="/help" className="flex-1 text-sm text-right">
            المساعدة
          </Link>
          <HelpCircle className="w-4 h-4" />
        </DropdownMenuItem>

        <div className="h-px bg-gray-200 my-1" />

        <DropdownMenuItem onClick={() => signOut()} className="flex gap-2">
          <span className="flex-1 text-sm">تسجيل الخروج</span>
          <LogOut className="w-4 h-4" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
