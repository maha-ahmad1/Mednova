"use client";

import { useTranslations, useLocale } from "next-intl";
import { formatDistanceToNow, format, type Locale } from "date-fns";
import { ar, enUS } from "date-fns/locale";
import {
  ShieldCheck,
  Clock,
  Wallet,
  CheckCircle2,
  Lock,
  RotateCcw,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  type FinancialStatus,
  type AnyConsultationFinancial,
  isPatientFinancial,
  isConsultantFinancial,
} from "@/features/payment/types";

type ActionKey = "openDispute" | "contactSupport" | "withdraw";

interface BannerConfig {
  icon: LucideIcon;
  bg: string;
  border: string;
  iconBg: string;
  text: string;
  actions: ActionKey[];
}

const BANNER_CONFIG: Partial<Record<FinancialStatus, BannerConfig>> = {
  held: {
    icon: ShieldCheck,
    bg: "from-emerald-50/80 to-teal-50/50",
    border: "border-emerald-200/60",
    iconBg: "bg-emerald-100/80",
    text: "text-emerald-800",
    actions: [],
  },
  review_window: {
    icon: Clock,
    bg: "from-amber-50/80 to-yellow-50/50",
    border: "border-amber-200/60",
    iconBg: "bg-amber-100/80",
    text: "text-amber-800",
    actions: ["openDispute", "contactSupport"],
  },
  withdrawable: {
    icon: Wallet,
    bg: "from-blue-50/80 to-indigo-50/50",
    border: "border-blue-200/60",
    iconBg: "bg-blue-100/80",
    text: "text-blue-800",
    actions: ["withdraw"],
  },
  withdrawn: {
    icon: CheckCircle2,
    bg: "from-slate-50/80 to-gray-50/50",
    border: "border-slate-200/60",
    iconBg: "bg-slate-100/80",
    text: "text-slate-800",
    actions: [],
  },
  frozen: {
    icon: Lock,
    bg: "from-rose-50/80 to-red-50/50",
    border: "border-rose-200/60",
    iconBg: "bg-rose-100/80",
    text: "text-rose-800",
    actions: ["contactSupport"],
  },
  refunded: {
    icon: RotateCcw,
    bg: "from-violet-50/80 to-purple-50/50",
    border: "border-violet-200/60",
    iconBg: "bg-violet-100/80",
    text: "text-violet-800",
    actions: [],
  },
  refunded_internal: {
    icon: RotateCcw,
    bg: "from-slate-50/80 to-gray-50/50",
    border: "border-slate-200/60",
    iconBg: "bg-slate-100/80",
    text: "text-slate-800",
    actions: [],
  },
};

interface FinancialStatusBannerProps {
  status: FinancialStatus;
  financial: AnyConsultationFinancial;
  reviewDeadline?: string | null;
  releasedAt?: string | null;
  onOpenDispute?: () => void;
  onContactSupport?: () => void;
  onWithdraw?: () => void;
}

export default function FinancialStatusBanner({
  status,
  financial,
  reviewDeadline,
  releasedAt,
  onOpenDispute,
  onContactSupport,
  onWithdraw,
}: FinancialStatusBannerProps) {
  const t = useTranslations("consultations.details.banners");
  const locale = useLocale();
  const dateLocale = locale === "ar" ? ar : enUS;

  const config = BANNER_CONFIG[status];
  if (!config) return null;

  const Icon = config.icon;
  const isPatient = isPatientFinancial(financial);
  const isConsultant = isConsultantFinancial(financial);

  const desc = resolveDesc({
    status,
    isPatient,
    isConsultant,
    reviewDeadline,
    releasedAt,
    dateLocale,
    t,
  });

  const title = resolveTitle(status, isPatient, t);

  const actionHandlers: Record<ActionKey, (() => void) | undefined> = {
    openDispute: onOpenDispute,
    contactSupport: onContactSupport,
    withdraw: onWithdraw,
  };

  return (
    <Card className={cn("overflow-hidden border shadow-md", config.border)}>
      <CardContent
        className={cn("bg-gradient-to-r p-0", config.bg)}
      >
        <div className="space-y-4 px-5 py-5">
          <div className="flex items-start gap-3">
            <div
              className={cn(
                "mt-0.5 rounded-full p-2 shadow-sm",
                config.iconBg,
              )}
            >
              <Icon className={cn("h-5 w-5", config.text)} />
            </div>
            <div className="flex-1">
              <p className={cn("text-sm font-semibold", config.text)}>
                {title}
              </p>
              {desc && (
                <p className="mt-0.5 text-xs text-muted-foreground">{desc}</p>
              )}
            </div>
          </div>

          {config.actions.length > 0 && (
            <div className="flex flex-wrap gap-3">
              {config.actions.map((key) => (
                <div key={key} className="flex flex-col items-start gap-0.5">
                  <Button
                    disabled={!actionHandlers[key]}
                    onClick={actionHandlers[key]}
                    variant="outline"
                    size="sm"
                    className="bg-white/70"
                  >
                    {t(`actions.${key}`)}
                  </Button>
                  {!actionHandlers[key] && (
                    <span className="text-center text-xs text-muted-foreground opacity-70">
                      {t("actions.comingSoon")}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// ── Helpers ───────────────────────────────────────────────────

type TFn = ReturnType<typeof useTranslations<"consultations.details.banners">>;

function resolveTitle(status: FinancialStatus, isPatient: boolean, t: TFn): string {
  switch (status) {
    case "held":
      return isPatient ? t("held.titlePatient") : t("held.titleConsultant");
    case "review_window":
      return t("reviewWindow.title");
    case "withdrawable":
      return t("withdrawable.title");
    case "withdrawn":
      return t("withdrawn.title");
    case "frozen":
      return t("frozen.title");
    case "refunded":
      return t("refunded.title");
    case "refunded_internal":
      return t("refundedInternal.title");
    default:
      return "";
  }
}

function resolveDesc({
  status,
  isPatient,
  isConsultant,
  reviewDeadline,
  releasedAt,
  dateLocale,
  t,
}: {
  status: FinancialStatus;
  isPatient: boolean;
  isConsultant: boolean;
  reviewDeadline?: string | null;
  releasedAt?: string | null;
  dateLocale: Locale;
  t: TFn;
}): string {
  switch (status) {
    case "held":
      if (isPatient) return t("held.descPatient");
      if (isConsultant) return t("held.descConsultant");
      return t("held.descConsultant");

    case "review_window": {
      if (isPatient) {
        if (reviewDeadline) {
          const deadline = formatDistanceToNow(new Date(reviewDeadline), {
            addSuffix: true,
            locale: dateLocale,
          });
          return t("reviewWindow.descPatient", { deadline });
        }
        return t("reviewWindow.descPatient", { deadline: "" }).replace(
          / \{\}| \{ \}/g,
          "",
        );
      }
      if (reviewDeadline) {
        const deadline = formatDistanceToNow(new Date(reviewDeadline), {
          addSuffix: true,
          locale: dateLocale,
        });
        return t("reviewWindow.descConsultantWithDeadline", { deadline });
      }
      return t("reviewWindow.descConsultant");
    }

    case "withdrawable":
      return t("withdrawable.desc");

    case "withdrawn": {
      if (releasedAt) {
        const date = format(new Date(releasedAt), "d MMMM yyyy", {
          locale: dateLocale,
        });
        return t("withdrawn.descWithDate", { date });
      }
      return t("withdrawn.desc");
    }

    case "frozen":
      if (isPatient) return t("frozen.descPatient");
      if (isConsultant) return t("frozen.descConsultant");
      return t("frozen.descConsultant");

    case "refunded":
      return t("refunded.desc");

    case "refunded_internal":
      return t("refundedInternal.desc");

    default:
      return "";
  }
}
