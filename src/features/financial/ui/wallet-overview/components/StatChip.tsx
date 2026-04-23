import { cn } from "@/lib/utils";

interface StatChipProps {
  icon: React.ReactNode;
  iconBg: string;
  label: string;
  value: string;
  unit?: string;
}

export function StatChip({ icon, iconBg, label, value, unit }: StatChipProps) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border/50 bg-white px-4 py-3 shadow-sm flex-1">
      <div className={cn("rounded-xl p-2", iconBg)}>{icon}</div>
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
