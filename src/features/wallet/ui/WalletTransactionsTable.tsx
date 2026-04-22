import { Download, Search, CalendarDays } from "lucide-react";
import type { WalletTransaction } from "../types";
import { formatDateTime } from "../utils/formatters";

type Props = {
  title: string;
  subtitle: string;
  transactions: WalletTransaction[];
};

const statusClass = (label: string) => {
  if (label.includes("متاح") || label.includes("مكتمل")) return "bg-[#e8f8f2] text-[#0c9b71]";
  if (label.includes("معل")) return "bg-[#fff5e9] text-[#d28c2d]";
  if (label.includes("مجم")) return "bg-[#ffecef] text-[#db5e7b]";
  return "bg-[#f4f7f6] text-[#6e7f7a]";
};

const typeClass = (amount: string) => {
  if (amount.startsWith("+")) return "bg-[#e8f8f2] text-[#0c9b71]";
  if (amount.startsWith("-")) return "bg-[#ffecef] text-[#db5e7b]";
  return "bg-[#f4f7f6] text-[#6e7f7a]";
};

export const WalletTransactionsTable = ({ title, subtitle, transactions }: Props) => {
  return (
    <section className="rounded-3xl border border-[#e6ece9] bg-white p-5 shadow-sm">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-[#122523]">{title}</h2>
          <p className="text-sm text-[#8d9b97]">{subtitle}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button type="button" className="inline-flex items-center gap-2 rounded-xl border border-[#e3eae7] px-3 py-2 text-sm text-[#516360]">
            <Download className="h-4 w-4" />
            تصدير
          </button>
          <button type="button" className="inline-flex items-center gap-2 rounded-xl border border-[#e3eae7] px-3 py-2 text-sm text-[#516360]">
            <CalendarDays className="h-4 w-4" />
            آخر 30 يوم
          </button>
          <label className="flex items-center gap-2 rounded-xl border border-[#e3eae7] px-3 py-2 text-sm text-[#8d9b97]">
            <Search className="h-4 w-4" />
            <input
              className="w-44 bg-transparent text-sm text-[#223533] outline-none placeholder:text-[#9babaa]"
              placeholder="ابحث برقم المعاملة أو العميل..."
            />
          </label>
        </div>
      </div>

      <div className="mb-2 flex flex-wrap items-center gap-3 border-b border-[#edf1ef] pb-3 text-sm text-[#6f7f7b]">
        <button type="button" className="rounded-full bg-[#e7f7f1] px-3 py-1 text-[#129e74]">كل الحركات</button>
        <button type="button" className="rounded-full bg-[#f3f6f5] px-3 py-1">إيداعات</button>
        <button type="button" className="rounded-full bg-[#f3f6f5] px-3 py-1">سحوبات</button>
        <button type="button" className="rounded-full bg-[#f3f6f5] px-3 py-1">معلقة</button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-right text-sm">
          <thead>
            <tr className="border-b border-[#edf1ef] text-[#8d9b97]">
              <th className="px-3 py-3 font-medium">العميل / العملية</th>
              <th className="px-3 py-3 font-medium">رقم المعاملة</th>
              <th className="px-3 py-3 font-medium">النوع</th>
              <th className="px-3 py-3 font-medium">المبلغ</th>
              <th className="px-3 py-3 font-medium">الحالة</th>
              <th className="px-3 py-3 font-medium">التاريخ</th>
            </tr>
          </thead>

          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction.id} className="border-b border-[#f1f4f3] last:border-b-0">
                <td className="px-3 py-4 text-[#19312d]">
                  <p className="font-medium">{transaction.consultation?.patient_name ?? transaction.consultation?.consultant_name ?? transaction.label}</p>
                  <p className="text-xs text-[#8fa09b]">{transaction.description || transaction.note || "—"}</p>
                </td>
                <td className="px-3 py-4 text-[#6f7f7b]">TRX-{transaction.id}</td>
                <td className="px-3 py-4">
                  <span className={`rounded-full px-3 py-1 text-xs ${typeClass(transaction.amount)}`}>{transaction.label}</span>
                </td>
                <td className="px-3 py-4 text-base font-semibold text-[#163531]">{transaction.amount}</td>
                <td className="px-3 py-4">
                  <span className={`rounded-full px-3 py-1 text-xs ${statusClass(transaction.status_label)}`}>{transaction.status_label}</span>
                </td>
                <td className="px-3 py-4 text-[#6f7f7b]">{formatDateTime(transaction.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {transactions.length === 0 && (
        <p className="py-12 text-center text-sm text-[#8d9b97]">لا توجد معاملات لعرضها حالياً.</p>
      )}
    </section>
  );
};
