import { BadgeDollarSign, Clock3, WalletCards, ShieldAlert, Users, CheckCircle2, DollarSign } from "lucide-react";
import type { WalletRole, WalletSummary } from "../types";
import { formatAmount } from "../utils/formatters";

type Props = {
  summary: WalletSummary;
  role: WalletRole;
};

type SummaryCard = {
  title: string;
  value: number | string | undefined;
  icon: typeof WalletCards;
  highlight?: boolean;
  hint?: string;
};

export const WalletSummaryCards = ({ summary, role }: Props) => {
  const currency = summary.currency || "OMR";

  const primaryCards: SummaryCard[] =
    role === "consultant"
      ? [
          {
            title: "الرصيد المتاح للسحب",
            value: summary.withdrawable_balance ?? summary.available_balance,
            icon: WalletCards,
            highlight: true,
            hint: "يمكنك سحب هذا الرصيد الآن",
          },
          {
            title: "إجمالي المحفظة",
            value: summary.total_balance,
            icon: BadgeDollarSign,
          },
          {
            title: "رصيد مجمد",
            value: summary.frozen_balance ?? 0,
            icon: ShieldAlert,
            hint: "مبالغ تحت المراجعة أو النزاع",
          },
          {
            title: "رصيد معلق",
            value: summary.pending_balance ?? 0,
            icon: Clock3,
            hint: "مبالغ قيد المعالجة",
          },
        ]
      : [
          {
            title: "الرصيد المتاح للسحب",
            value: summary.available_balance,
            icon: WalletCards,
            highlight: true,
            hint: "يمكن طلب السحب لهذا الرصيد",
          },
          {
            title: "إجمالي المحفظة",
            value: summary.total_balance,
            icon: BadgeDollarSign,
          },
          {
            title: "سحب قيد المعالجة",
            value: summary.pending_withdrawal ?? summary.pending_balance ?? 0,
            icon: Clock3,
          },
          {
            title: "رصيد متاح",
            value: summary.available_balance,
            icon: DollarSign,
          },
        ];

  const secondaryCards =
    role === "consultant"
      ? [
          { title: "جلسات مكتملة هذا الشهر", value: "—", icon: CheckCircle2 },
          { title: "عملاء نشطون", value: "—", icon: Users },
          { title: "متوسط سعر الجلسة", value: `— ${currency}`, icon: DollarSign },
        ]
      : [
          { title: "عمليات دفع مكتملة", value: "—", icon: CheckCircle2 },
          { title: "عمليات استرداد", value: "—", icon: ShieldAlert },
          { title: "إجمالي السحوبات", value: "—", icon: WalletCards },
        ];

  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
        {primaryCards.map((card) => {
          const Icon = card.icon;

          return (
            <article
              key={card.title}
              className={[
                "rounded-3xl border p-5 shadow-sm transition-all",
                card.highlight
                  ? "border-[#20b486] bg-gradient-to-b from-[#22b889] to-[#16a173] text-white"
                  : "border-[#e6ece9] bg-white text-[#112222]",
              ].join(" ")}
            >
              <div className="mb-5 flex items-start justify-between">
                <span
                  className={[
                    "rounded-2xl p-3",
                    card.highlight ? "bg-white/20 text-white" : "bg-[#f1f8f5] text-[#18a07d]",
                  ].join(" ")}
                >
                  <Icon className="h-5 w-5" />
                </span>
                {!card.highlight && (
                  <span className="rounded-full bg-[#f7faf9] px-2 py-1 text-[11px] text-[#7f8b88]">OMR</span>
                )}
              </div>

              <p className={card.highlight ? "text-sm text-white/85" : "text-sm text-[#73807d]"}>{card.title}</p>
              <p className="mt-2 text-2xl font-bold tracking-tight">{formatAmount(card.value, currency)}</p>
              {card.hint && (
                <p className={card.highlight ? "mt-2 text-xs text-white/80" : "mt-2 text-xs text-[#97a3a0]"}>
                  {card.hint}
                </p>
              )}
            </article>
          );
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {secondaryCards.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.title} className="rounded-2xl border border-[#e6ece9] bg-white px-5 py-4 shadow-sm">
              <div className="flex items-center justify-between text-[#8a9693]">
                <p className="text-sm">{item.title}</p>
                <span className="rounded-xl bg-[#f3f7f6] p-2">
                  <Icon className="h-4 w-4" />
                </span>
              </div>
              <p className="mt-3 text-xl font-semibold text-[#102421]">{item.value}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
