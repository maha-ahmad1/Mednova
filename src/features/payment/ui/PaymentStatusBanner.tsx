"use client";

import { CheckCircle2, Clock, Loader2, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { PaymentStatusType } from "@/features/payment/types";

export function PaymentStatusBanner({ status }: { status: PaymentStatusType }) {
  const t = useTranslations("payment");

  const config = {
    loading: {
      icon: <Loader2 className="h-4 w-4 animate-spin text-primary" />,
      title: t("banner.loadingTitle"),
      desc: t("banner.loadingDesc"),
      bg: "from-blue-50/80 to-indigo-50/50",
      text: "text-blue-800",
    },
    paid: {
      icon: <CheckCircle2 className="h-4 w-4 text-emerald-700" />,
      title: t("banner.paidTitle"),
      desc: t("banner.paidDesc"),
      bg: "from-emerald-50/80 to-teal-50/50",
      text: "text-emerald-800",
    },
    failed: {
      icon: <X className="h-4 w-4 text-rose-700" />,
      title: t("banner.failedTitle"),
      desc: t("banner.failedDesc"),
      bg: "from-rose-50/80 to-red-50/50",
      text: "text-rose-800",
    },
    pending: {
      icon: <Clock className="h-4 w-4 text-amber-700" />,
      title: t("banner.pendingTitle"),
      desc: t("banner.pendingDesc"),
      bg: "from-amber-50/80 to-yellow-50/50",
      text: "text-amber-800",
    },
    //  unpaid: {
    //   icon: <Clock className="h-4 w-4 text-amber-700" />,
    //   title: "مش مدفوع ",
    //   desc: "الرجاء الدفع لإكمال العملية",
    //   bg: "from-amber-50/80 to-yellow-50/50",
    //   text: "text-amber-800",
    // },
  };

  const c = config[status];

  return (
    <Card className="overflow-hidden border-0 shadow-md">
      <CardContent className={cn("bg-gradient-to-r p-0", c.bg)}>
        <div className="flex items-center gap-3 px-5 py-4">
          <div className="rounded-full bg-white/60 p-1.5 shadow-sm">
            {c.icon}
          </div>
          <div>
            <p className={cn("text-sm font-semibold", c.text)}>{c.title}</p>
            <p className="text-xs text-muted-foreground">{c.desc}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
