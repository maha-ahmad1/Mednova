import type { WalletPayment } from "../types";
import { formatDateTime } from "../utils/formatters";

type Props = {
  payments: WalletPayment[];
};

export const WalletPaymentsTable = ({ payments }: Props) => {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold text-gray-800">سجل المدفوعات</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full text-right text-sm">
          <thead>
            <tr className="border-b text-gray-500">
              <th className="px-3 py-2">الاستشارة</th>
              <th className="px-3 py-2">المبلغ المدفوع</th>
              <th className="px-3 py-2">رسوم البوابة</th>
              <th className="px-3 py-2">طريقة الدفع</th>
              <th className="px-3 py-2">الحالة</th>
              <th className="px-3 py-2">التاريخ</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.id} className="border-b last:border-b-0">
                <td className="px-3 py-3 text-gray-700">
                  {payment.consultation
                    ? `${payment.consultation.type === "chat" ? "نصية" : "فيديو"} - ${payment.consultation.consultant_name ?? "-"}`
                    : "-"}
                </td>
                <td className="px-3 py-3 font-semibold">{payment.amount_paid}</td>
                <td className="px-3 py-3 text-gray-700">{payment.gateway_fee}</td>
                <td className="px-3 py-3 text-gray-700">{payment.payment_method}</td>
                <td className="px-3 py-3 text-gray-700">
                  {payment.status_label}
                  {payment.is_refunded && (
                    <span className="mr-2 rounded-full bg-emerald-100 px-2 py-1 text-xs text-emerald-700">تم الاسترداد</span>
                  )}
                </td>
                <td className="px-3 py-3 text-gray-500">{formatDateTime(payment.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {payments.length === 0 && (
        <p className="py-10 text-center text-sm text-gray-500">لا توجد مدفوعات لعرضها حالياً.</p>
      )}
    </section>
  );
};
