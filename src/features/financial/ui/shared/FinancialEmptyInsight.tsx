import { TrendingUp } from "lucide-react";

interface FinancialEmptyInsightProps {
  title: string;
  subtitle: string;
}

export function FinancialEmptyInsight({ title, subtitle }: FinancialEmptyInsightProps) {
  return (
    <div className="flex items-start gap-4 rounded-2xl border border-dashed border-border/60 bg-muted/30 px-5 py-4 shadow-sm">
      <div className="rounded-xl bg-[#32A88D]/10 p-2.5 shrink-0">
        <TrendingUp className="h-5 w-5 text-[#32A88D]" />
      </div>
      <div>
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
      </div>
    </div>
  );
}
