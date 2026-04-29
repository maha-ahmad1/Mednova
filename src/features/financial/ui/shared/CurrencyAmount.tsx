import { cn } from "@/lib/utils";

interface CurrencyAmountProps {
  amount: number;
  currency?: string;
  /** Show +/- prefix and color the amount green (positive) or red (negative) */
  signed?: boolean;
  /** White text for use on dark gradient backgrounds */
  inverted?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function CurrencyAmount({
  amount,
  currency = "OMR",
  signed = false,
  inverted = false,
  size = "md",
  className,
}: CurrencyAmountProps) {
  const isNegative = amount < 0;
  const formatted = Math.abs(amount).toLocaleString("en-US", {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  });
  const sign = isNegative ? "−" : signed ? "+" : "";

  return (
    <span
      className={cn(
        "tabular-nums inline-flex items-baseline gap-1",
        !inverted && signed && !isNegative && "text-emerald-600",
        !inverted && signed && isNegative && "text-destructive",
        !inverted && !signed && "text-foreground",
        inverted && "text-white",
        size === "sm" && "text-sm font-medium",
        size === "md" && "text-base font-semibold",
        size === "lg" && "text-2xl font-bold",
        className,
      )}
    >
      {sign}
      {formatted}
      <span
        className={cn(
          "font-normal",
          size === "lg" ? "text-[11px]" : "text-xs",
          inverted ? "text-white/70" : "text-muted-foreground",
        )}
      >
        {currency}
      </span>
    </span>
  );
}
