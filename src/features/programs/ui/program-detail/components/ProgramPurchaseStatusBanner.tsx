import { CheckCircle2, Clock, Loader2, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { PurchaseStatus } from "@/features/programs/types/purchase";

export type PurchaseBannerStatus = PurchaseStatus | "timeout";

// Same visual pattern as payment/ui/PaymentStatusBanner.tsx (card + icon + title/desc),
// kept local since the consultations component is keyed to a different status enum.
export function ProgramPurchaseStatusBanner({ status }: { status: PurchaseBannerStatus }) {
  const t = useTranslations("programs.purchase");

  const config: Record<PurchaseBannerStatus, {
    icon: React.ReactNode;
    bg: string;
    text: string;
  }> = {
    unpaid: {
      icon: <Loader2 className="h-4 w-4 animate-spin text-amber-700" />,
      bg: "from-amber-50/80 to-yellow-50/50",
      text: "text-amber-800",
    },
    paid: {
      icon: <CheckCircle2 className="h-4 w-4 text-emerald-700" />,
      bg: "from-emerald-50/80 to-teal-50/50",
      text: "text-emerald-800",
    },
    payment_suspended: {
      icon: <X className="h-4 w-4 text-rose-700" />,
      bg: "from-rose-50/80 to-red-50/50",
      text: "text-rose-800",
    },
    expired: {
      icon: <X className="h-4 w-4 text-rose-700" />,
      bg: "from-rose-50/80 to-red-50/50",
      text: "text-rose-800",
    },
    timeout: {
      icon: <Clock className="h-4 w-4 text-amber-700" />,
      bg: "from-amber-50/80 to-yellow-50/50",
      text: "text-amber-800",
    },
  };

  const c = config[status];

  return (
    <Card className="overflow-hidden border-0 shadow-md">
      <CardContent className={cn("bg-gradient-to-r p-0", c.bg)}>
        <div className="flex items-center gap-3 px-5 py-4">
          <div className="rounded-full bg-white/60 p-1.5 shadow-sm">{c.icon}</div>
          <div>
            <p className={cn("text-sm font-semibold", c.text)}>{t(`banner.${status}.title`)}</p>
            <p className="text-xs text-muted-foreground">{t(`banner.${status}.desc`)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
