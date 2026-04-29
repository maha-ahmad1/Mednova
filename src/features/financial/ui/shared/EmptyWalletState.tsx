import type { ReactNode } from "react";
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
  title = "لا توجد بيانات",
  description = "لا توجد سجلات لعرضها في الوقت الحالي",
  icon,
  className,
}: EmptyWalletStateProps) {
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
      <p className="text-sm font-medium text-foreground mb-1">{title}</p>
      <p className="text-xs text-muted-foreground max-w-xs">{description}</p>
    </div>
  );
}
