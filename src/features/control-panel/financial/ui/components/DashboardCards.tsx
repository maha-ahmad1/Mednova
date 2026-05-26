"use client";

import type { ReactNode } from "react";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Landmark,
  Clock,
  Lock,
  CreditCard,
  CheckCircle2,
  Timer,
  Eye,
  AlertTriangle,
  RotateCcw,
  MessageCircleWarning,
  AlertCircle,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useAdminDashboard } from "../../hooks/useAdminDashboard";

// ─── Top-strip accent colours (RTL-neutral — top is always top) ────────────────
type Accent = "emerald" | "blue" | "amber" | "purple" | "rose" | "slate" | "none";

const STRIP: Record<Accent, string> = {
  emerald: "bg-emerald-400",
  blue: "bg-blue-500",
  amber: "bg-amber-400",
  purple: "bg-purple-500",
  rose: "bg-rose-500",
  slate: "bg-slate-300",
  none: "",
};

// ─── Stat card ─────────────────────────────────────────────────────────────────

interface StatCardProps {
  icon: ReactNode;
  iconBg: string;
  label: string;
  value: string;
  unit?: string;
  accent?: Accent;
  /** "large" → wallet-level card (bigger number, taller) */
  size?: "large" | "default" | "compact";
  isLoading?: boolean;
}

function StatCard({
  icon,
  iconBg,
  label,
  value,
  unit,
  accent = "none",
  size = "default",
  isLoading,
}: StatCardProps) {
  const padding = size === "large" ? "p-5" : "p-4";
  const iconSize = size === "large" ? "h-10 w-10" : "h-8 w-8";
  const valueSize =
    size === "large"
      ? "text-xl sm:text-2xl"
      : size === "compact"
        ? "text-base"
        : "text-base";
  const labelSize =
    size === "compact" ? "text-[10px] leading-none" : "text-[11px] leading-none";

  if (isLoading) {
    return (
      <div className="overflow-hidden rounded-xl border border-border/50 bg-white shadow-sm">
        {accent !== "none" && (
          <div className={cn("h-0.5 w-full", STRIP[accent])} />
        )}
        <div className={cn(padding, "space-y-2")}>
          <Skeleton className={cn("rounded-lg", iconSize)} />
          <Skeleton className="h-2.5 w-20 rounded" />
          <Skeleton className={cn("rounded", size === "large" ? "h-7 w-28" : "h-5 w-20")} />
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-border/50 bg-white shadow-sm",
        "hover:border-border hover:shadow-md transition-all duration-150",
      )}
    >
      {/* Top colour strip — RTL neutral */}
      {accent !== "none" && STRIP[accent] && (
        <div className={cn("h-0.5 w-full", STRIP[accent])} />
      )}

      <div className={cn(padding, "flex flex-col items-start")}>
        {/* Icon — inline-start in RTL = right side */}
        <div
          className={cn(
            "inline-flex items-center justify-center rounded-xl mb-3",
            iconSize,
            iconBg,
          )}
        >
          {icon}
        </div>

        {/* Label */}
        <p className={cn(labelSize, "text-muted-foreground text-start mb-1.5")}>
          {label}
        </p>

        {/* Value */}
        <p
          className={cn(
            "font-bold tabular-nums text-foreground text-start leading-tight",
            valueSize,
          )}
        >
          {value}
          {unit && (
            <span
              className={cn(
                "font-normal text-muted-foreground ms-1.5",
                size === "large" ? "text-xs" : "text-[10px]",
              )}
            >
              {unit}
            </span>
          )}
        </p>
      </div>
    </div>
  );
}

// ─── Section heading ───────────────────────────────────────────────────────────

function SectionHeading({ children }: { children: ReactNode }) {
  return (
    // In RTL flex-row the first child (the bar) appears on the RIGHT (reading start)
    <div className="flex items-center gap-2 mb-3">
      <div className="h-4 w-0.5 rounded-full bg-[#32A88D] shrink-0" />
      <h3 className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
        {children}
      </h3>
    </div>
  );
}

// ─── Loading skeleton for a section ───────────────────────────────────────────

function SectionSkeleton({
  count,
  cols,
  cardSize = "default",
}: {
  count: number;
  cols: string;
  cardSize?: "large" | "default" | "compact";
}) {
  return (
    <div className="mb-7">
      <Skeleton className="h-3 w-28 mb-3 rounded" />
      <div className={cn("grid gap-3", cols)}>
        {Array.from({ length: count }).map((_, i) => (
          <StatCard
            key={i}
            icon={null}
            iconBg="bg-muted"
            label=""
            value=""
            size={cardSize}
            isLoading
          />
        ))}
      </div>
    </div>
  );
}

// ─── Amount formatting ─────────────────────────────────────────────────────────

function fmtAmount(raw: string): string {
  const n = parseFloat(raw);
  return n.toLocaleString("en-US", {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  });
}

// ─── Main component ────────────────────────────────────────────────────────────

export function DashboardCards() {
  const t = useTranslations("controlPanel.financial");
  const { data: envelope, isLoading, isError } = useAdminDashboard();

  // Error ─────────────────────────────────────────────────────────────────────
  if (isError) {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
        <AlertCircle className="h-4 w-4 shrink-0" />
        <span>{t("overview.loadError")}</span>
      </div>
    );
  }

  // Loading ───────────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="space-y-6">
        <SectionSkeleton count={4} cols="grid-cols-2 sm:grid-cols-4" cardSize="large" />
        <SectionSkeleton count={2} cols="grid-cols-2 sm:grid-cols-4" />
        <SectionSkeleton count={6} cols="grid-cols-2 sm:grid-cols-3 lg:grid-cols-6" cardSize="compact" />
        <SectionSkeleton count={2} cols="grid-cols-2 sm:grid-cols-4" />
      </div>
    );
  }

  const d = envelope?.data;
  if (!d) return null;

  const { wallet, consultations, revenue, disputes } = d;

  return (
    <div className="space-y-8">

      {/* ── 1. Platform Wallet (most prominent, shown first) ─────────────── */}
      <div>
        <SectionHeading>{t("overview.sectionWallet")}</SectionHeading>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard
            icon={<Landmark className="h-5 w-5 text-blue-600" />}
            iconBg="bg-blue-50"
            label={t("overview.totalBalance")}
            value={fmtAmount(wallet.total_balance)}
            unit={wallet.currency}
            accent="blue"
            size="large"
          />
          <StatCard
            icon={<Wallet className="h-5 w-5 text-emerald-600" />}
            iconBg="bg-emerald-50"
            label={t("overview.availableBalance")}
            value={fmtAmount(wallet.available_balance)}
            unit={wallet.currency}
            accent="emerald"
            size="large"
          />
          <StatCard
            icon={<Clock className="h-5 w-5 text-amber-500" />}
            iconBg="bg-amber-50"
            label={t("overview.pendingBalance")}
            value={fmtAmount(wallet.pending_balance)}
            unit={wallet.currency}
            accent="amber"
            size="large"
          />
          <StatCard
            icon={<Lock className="h-5 w-5 text-purple-600" />}
            iconBg="bg-purple-50"
            label={t("overview.frozenBalance")}
            value={fmtAmount(wallet.frozen_balance)}
            unit={wallet.currency}
            accent="purple"
            size="large"
          />
        </div>
      </div>

      {/* ── 2. Revenue ───────────────────────────────────────────────────── */}
      <div>
        <SectionHeading>{t("overview.sectionRevenue")}</SectionHeading>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard
            icon={<TrendingUp className="h-4 w-4 text-emerald-600" />}
            iconBg="bg-emerald-50"
            label={t("overview.thisMonth")}
            value={fmtAmount(revenue.this_month)}
            unit={revenue.currency}
            accent="emerald"
          />
          <StatCard
            icon={<TrendingDown className="h-4 w-4 text-slate-400" />}
            iconBg="bg-slate-100"
            label={t("overview.lastMonth")}
            value={fmtAmount(revenue.last_month)}
            unit={revenue.currency}
          />
        </div>
      </div>

      {/* ── 3. Consultation Finances ─────────────────────────────────────── */}
      <div>
        <SectionHeading>{t("overview.sectionConsultations")}</SectionHeading>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <StatCard
            icon={<CreditCard className="h-4 w-4 text-blue-600" />}
            iconBg="bg-blue-50"
            label={t("overview.totalPaid")}
            value={String(consultations.total_paid)}
            size="compact"
          />
          <StatCard
            icon={<CheckCircle2 className="h-4 w-4 text-emerald-600" />}
            iconBg="bg-emerald-50"
            label={t("overview.totalSettled")}
            value={String(consultations.total_settled)}
            size="compact"
          />
          <StatCard
            icon={<Timer className="h-4 w-4 text-amber-500" />}
            iconBg="bg-amber-50"
            label={t("overview.totalHeld")}
            value={String(consultations.total_held)}
            size="compact"
          />
          <StatCard
            icon={<Eye className="h-4 w-4 text-sky-600" />}
            iconBg="bg-sky-50"
            label={t("overview.totalInReview")}
            value={String(consultations.total_in_review)}
            size="compact"
          />
          <StatCard
            icon={<AlertTriangle className="h-4 w-4 text-orange-500" />}
            iconBg="bg-orange-50"
            label={t("overview.totalInDispute")}
            value={String(consultations.total_in_dispute)}
            size="compact"
          />
          <StatCard
            icon={<RotateCcw className="h-4 w-4 text-rose-500" />}
            iconBg="bg-rose-50"
            label={t("overview.totalRefunded")}
            value={String(consultations.total_refunded)}
            size="compact"
          />
        </div>
      </div>

      {/* ── 4. Disputes ──────────────────────────────────────────────────── */}
      <div>
        <SectionHeading>{t("overview.sectionDisputes")}</SectionHeading>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard
            icon={<MessageCircleWarning className="h-4 w-4 text-rose-500" />}
            iconBg="bg-rose-50"
            label={t("overview.pendingDisputes")}
            value={String(disputes.pending_count)}
            accent="rose"
          />
          <StatCard
            icon={<Clock className="h-4 w-4 text-slate-400" />}
            iconBg="bg-slate-100"
            label={t("overview.avgResolutionHours")}
            value={String(disputes.avg_resolution_hours)}
            unit={t("overview.hours")}
          />
        </div>
      </div>

    </div>
  );
}
