import type { WalletTransaction } from "../types";
import { formatDateTime } from "../utils/formatters";

type Props = {
  title: string;
  transactions: WalletTransaction[];
};

export const WalletTransactionsTable = ({ title, transactions }: Props) => {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold text-gray-800">{title}</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full text-right text-sm">
          <thead>
            <tr className="border-b text-gray-500">
              <th className="px-3 py-2">النوع</th>
              <th className="px-3 py-2">الوصف</th>
              <th className="px-3 py-2">المبلغ</th>
              <th className="px-3 py-2">الحالة</th>
              <th className="px-3 py-2">التاريخ</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction.id} className="border-b last:border-b-0">
                <td className="px-3 py-3 font-medium text-gray-800">{transaction.label}</td>
                <td className="px-3 py-3 text-gray-600">
                  {transaction.consultation
                    ? `${transaction.consultation.type === "chat" ? "استشارة نصية" : "استشارة فيديو"}`
                    : transaction.description || "-"}
                </td>
                <td className="px-3 py-3 font-semibold">{transaction.amount}</td>
                <td className="px-3 py-3 text-gray-600">{transaction.status_label}</td>
                <td className="px-3 py-3 text-gray-500">{formatDateTime(transaction.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {transactions.length === 0 && (
        <p className="py-10 text-center text-sm text-gray-500">لا توجد معاملات لعرضها حالياً.</p>
      )}
    </section>
  );
};
