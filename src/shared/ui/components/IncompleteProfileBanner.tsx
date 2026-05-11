"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function IncompleteProfileBanner() {
  const { data: session } = useSession();
  const t = useTranslations("incompleteProfileBanner");
  const [dismissed, setDismissed] = useState(false);

  const isCompleted =
    session?.user?.is_completed ?? session?.user?.isCompleted ?? true;

  if (!session?.user || isCompleted || dismissed) return null;

  return (
    <div
      className={cn(
        "w-full bg-amber-50 border-b border-amber-200",
        "flex items-center justify-between gap-3 px-4 py-2.5",
      )}
      role="alert"
    >
      <p className="flex-1 text-center text-sm text-amber-800 font-medium">
        {t("message")}
      </p>

      <div className="flex items-center gap-2 shrink-0">
        <Button
          asChild
          size="sm"
          className="bg-amber-600 hover:bg-amber-700 text-white rounded-lg px-4 py-1.5 text-xs h-auto"
        >
          <Link href="/profile/create">{t("cta")}</Link>
        </Button>

        <button
          onClick={() => setDismissed(true)}
          aria-label={t("dismiss")}
          className="text-amber-600 hover:text-amber-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
