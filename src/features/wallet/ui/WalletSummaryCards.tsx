import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { WalletRole, WalletSummary } from "../types";
import { formatAmount } from "../utils/formatters";

type Props = {
  summary: WalletSummary;
  role: WalletRole;
};

export const WalletSummaryCards = ({ summary, role }: Props) => {
  const currency = summary.currency || "OMR";

  const cards =
    role === "consultant"
      ? [
          { title: "إجمالي الرصيد", value: summary.total_balance },
          { title: "الرصيد المتاح", value: summary.available_balance },
          { title: "الرصيد المعلّق", value: summary.pending_balance ?? 0 },
          { title: "الرصيد المجمّد", value: summary.frozen_balance ?? 0 },
          { title: "الرصيد المتاح للسحب", value: summary.withdrawable_balance ?? summary.available_balance },
        ]
      : [
          { title: "إجمالي الرصيد", value: summary.total_balance },
          { title: "الرصيد المتاح", value: summary.available_balance },
          { title: "سحب قيد المعالجة", value: summary.pending_withdrawal ?? 0 },
        ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">{card.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-[#0f172a]">{formatAmount(card.value, currency)}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
