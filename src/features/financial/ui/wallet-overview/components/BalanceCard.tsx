import { Info } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
// import { formatBalance } from "@/features/financial/utils/format";

interface BalanceCardProps {
  label: string;
  value: number;
  currency: string;
  icon: React.ReactNode;
  iconBg: string;
  note?: string;
  highlight?: boolean;
  onWithdraw?: () => void;
}

export function BalanceCard({
  label,
  value,
  currency,
  icon,
  iconBg,
  note,
  highlight,
  onWithdraw,
}: BalanceCardProps) {
  return (
    <Card
      className={cn(
        "relative overflow-hidden border-0 shadow-md transition-all hover:shadow-lg",
        highlight && "bg-gradient-to-br from-[#32A88D] to-[#1F6069] text-white"
      )}
    >
      <CardContent className="p-5 space-y-3">
        <div className={cn("rounded-xl p-2.5 w-fit", highlight ? "bg-white/20" : iconBg)}>
          {icon}
        </div>

        <div>
          <p
            className={cn(
              "text-xs font-medium mb-1",
              highlight ? "text-white/80" : "text-muted-foreground"
            )}
          >
            {label}
          </p>
          <div className="flex items-baseline gap-1.5">
            <span
              className={cn(
                "text-2xl font-bold tabular-nums",
                highlight ? "text-white" : "text-foreground"
              )}
            >
              {value}
            </span>
              <span
                className={cn(
                  "text-xs",
                  highlight ? "text-white/70" : "text-muted-foreground"
                )}
              >
                {currency}
              </span>
          </div>
          {note && (
            <p
              className={cn(
                "text-[11px] mt-1 flex items-center gap-1",
                highlight ? "text-white/70" : "text-muted-foreground"
              )}
            >
              {!highlight && <Info className="h-3 w-3" />}
              {note}
            </p>
          )}
        </div>

        {onWithdraw && (
          <Button
            size="sm"
            onClick={onWithdraw}
            className="w-full bg-white text-[#32A88D] hover:bg-white/90 font-semibold text-xs h-8 mt-1"
          >
            اسحب الآن
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
