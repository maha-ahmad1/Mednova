import type { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { CurrencyAmount } from "./CurrencyAmount";

interface WalletBalanceCardProps {
  label: string;
  amount: number;
  currency?: string;
  icon: ReactNode;
  iconBg: string;
  note?: string;
  /** Renders the card with the brand gradient background */
  highlight?: boolean;
  onWithdraw?: () => void;
  isLoading?: boolean;
}

export function WalletBalanceCard({
  label,
  amount,
  currency = "OMR",
  icon,
  iconBg,
  note,
  highlight = false,
  onWithdraw,
  isLoading = false,
}: WalletBalanceCardProps) {
  if (isLoading) {
    return (
      <Card className="border-0 shadow-md">
        <CardContent className="p-5 space-y-3 animate-pulse">
          <Skeleton className="h-10 w-10 rounded-xl" />
          <Skeleton className="h-3 w-24 rounded" />
          <Skeleton className="h-7 w-20 rounded" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={cn(
        "relative overflow-hidden border-0 shadow-md transition-all hover:shadow-lg",
        highlight && "bg-gradient-to-br from-[#32A88D] to-[#1F6069]",
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
              highlight ? "text-white/80" : "text-muted-foreground",
            )}
          >
            {label}
          </p>
          <CurrencyAmount
            amount={amount}
            currency={currency}
            size="lg"
            inverted={highlight}
          />
          {note && (
            <p
              className={cn(
                "text-[11px] mt-1",
                highlight ? "text-white/70" : "text-muted-foreground",
              )}
            >
              {note}
            </p>
          )}
        </div>

        {onWithdraw && (
          <Button
            size="sm"
            onClick={onWithdraw}
            className="w-full bg-white text-[#32A88D] hover:bg-white/90 font-semibold text-xs h-8"
          >
            اسحب الآن
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
