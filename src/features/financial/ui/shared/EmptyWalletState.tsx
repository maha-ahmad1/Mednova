import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Wallet } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyWalletStateProps {
  title?: string;
  description?: string;
  /** Custom icon — defaults to Wallet */
  icon?: ReactNode;
  className?: string;
}

export function EmptyWalletState({
  title,
  description,
  icon,
  className,
}: EmptyWalletStateProps) {
  const t = useTranslations("financial");
  const resolvedTitle = title ?? t("emptyState.defaultTitle");
  const resolvedDescription = description ?? t("emptyState.defaultDescription");
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-12 text-center",
        className,
      )}
    >
      <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mb-4">
        {icon ?? <Wallet className="w-7 h-7 text-muted-foreground" />}
      </div>
      <p className="text-sm font-medium text-foreground mb-1">{resolvedTitle}</p>
      <p className="text-xs text-muted-foreground max-w-xs">{resolvedDescription}</p>
    </div>
  );
}
