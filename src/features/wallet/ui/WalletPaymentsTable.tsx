import type { WalletPayment } from "../types";
import { formatDateTime } from "../utils/formatters";

type Props = {
  payments: WalletPayment[];
};

export const WalletPaymentsTable = ({ payments }: Props) => {
  return (
    <section className="rounded-3xl border border-[#e6ece9] bg-white p-5 shadow-sm">
      <div className="mb-3">
        <h2 className="text-2xl font-bold text-[#122523]">سجل المدفوعات</h2>
        <p className="text-sm text-[#8d9b97]">جميع المدفوعات التي تمت عبر البوابة</p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-right text-sm">
          <thead>
            <tr className="border-b border-[#edf1ef] text-[#8d9b97]">
              <th className="px-3 py-3 font-medium">الاستشارة</th>
              <th className="px-3 py-3 font-medium">المبلغ المدفوع</th>
              <th className="px-3 py-3 font-medium">رسوم البوابة</th>
              <th className="px-3 py-3 font-medium">طريقة الدفع</th>
              <th className="px-3 py-3 font-medium">الحالة</th>
              <th className="px-3 py-3 font-medium">التاريخ</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.id} className="border-b border-[#f1f4f3] last:border-b-0">
                <td className="px-3 py-4 text-[#19312d]">
                  <p className="font-medium">{payment.consultation?.consultant_name ?? "—"}</p>
                  <p className="text-xs text-[#8fa09b]">
                    {payment.consultation?.type === "chat" ? "استشارة نصية" : payment.consultation?.type === "video" ? "استشارة فيديو" : "—"}
                  </p>
                </td>
                <td className="px-3 py-4 text-base font-semibold text-[#163531]">{payment.amount_paid}</td>
                <td className="px-3 py-4 text-[#6f7f7b]">{payment.gateway_fee}</td>
                <td className="px-3 py-4 text-[#6f7f7b]">{payment.payment_method}</td>
                <td className="px-3 py-4">
                  <span className="rounded-full bg-[#e8f8f2] px-3 py-1 text-xs text-[#0c9b71]">{payment.status_label}</span>
                  {payment.is_refunded && (
                    <p className="mt-2 text-xs text-[#d17d15]">تم استرداد مبلغ الاستشارة</p>
                  )}
                </td>
                <td className="px-3 py-4 text-[#6f7f7b]">{formatDateTime(payment.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {payments.length === 0 && (
        <p className="py-12 text-center text-sm text-[#8d9b97]">لا توجد مدفوعات لعرضها حالياً.</p>
      )}
    </section>
  );
};
