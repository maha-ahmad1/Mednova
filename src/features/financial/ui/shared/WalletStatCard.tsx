import type { ReactNode } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface WalletStatCardProps {
  icon: ReactNode;
  iconBg: string;
  label: string;
  value: string;
  unit?: string;
  isLoading?: boolean;
  className?: string;
}

export function WalletStatCard({
  icon,
  iconBg,
  label,
  value,
  unit,
  isLoading = false,
  className,
}: WalletStatCardProps) {
  if (isLoading) {
    return (
      <div className="flex items-center gap-3 rounded-2xl border border-border/50 bg-white px-4 py-3 shadow-sm flex-1 animate-pulse">
        <Skeleton className="h-9 w-9 rounded-xl shrink-0" />
        <div className="space-y-1.5">
          <Skeleton className="h-2.5 w-24 rounded" />
          <Skeleton className="h-4 w-16 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-2xl border border-border/50 bg-white px-4 py-3 shadow-sm flex-1",
        className,
      )}
    >
      <div className={cn("rounded-xl p-2 shrink-0", iconBg)}>{icon}</div>
      <div>
        <p className="text-[11px] text-muted-foreground">{label}</p>
        <p className="text-sm font-bold tabular-nums">
          {value}
          {unit && (
            <span className="text-xs font-normal text-muted-foreground ms-1">
              {unit}
            </span>
          )}
        </p>
      </div>
    </div>
  );
}
