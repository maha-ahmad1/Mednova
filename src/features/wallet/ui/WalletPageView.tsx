"use client";

import { useMemo } from "react";
import { ArrowUp, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWalletData } from "../hooks/useWalletData";
import { WalletSummaryCards } from "./WalletSummaryCards";
import { WalletTransactionsTable } from "./WalletTransactionsTable";
import { WalletPaymentsTable } from "./WalletPaymentsTable";
import { WalletIncomeChart } from "./WalletIncomeChart";
import { formatDateTime } from "../utils/formatters";

export const WalletPageView = () => {
  const {
    walletRole,
    page,
    setPage,
    walletSummary,
    consultantTransactions,
    patientPayments,
    patientTransactions,
  } = useWalletData();

  const summary = walletSummary.data;

  const pagination =
    (walletRole === "consultant" ? consultantTransactions.data : patientTransactions.data)?.meta ??
    (walletRole === "consultant" ? consultantTransactions.data : patientTransactions.data)?.pagination;

  const transactionRows = useMemo(
    () => (walletRole === "consultant" ? consultantTransactions.data?.data : patientTransactions.data?.data) ?? [],
    [walletRole, consultantTransactions.data?.data, patientTransactions.data?.data]
  );

  if (!walletRole) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-800">
        لا يمكن عرض المحفظة لهذا النوع من الحساب.
      </div>
    );
  }

  return (
    <div className="space-y-5 text-[#132724]">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm text-[#8ea09b]">لوحة المستشار · المحفظة المالية</p>
          <h1 className="mt-1 text-4xl font-bold">المحفظة المالية</h1>
          <p className="mt-1 text-sm text-[#8ea09b]">
            آخر تحديث: {summary?.last_updated ? formatDateTime(summary.last_updated) : "—"}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button className="rounded-xl bg-[#20b486] hover:bg-[#19a97d]">
            <ArrowUp className="ml-2 h-4 w-4" />
            طلب سحب
          </Button>
          <Button variant="outline" className="rounded-xl border-[#dde8e4] text-[#344e49]">
            <Download className="ml-2 h-4 w-4" />
            تصدير كشف حساب
          </Button>
        </div>
      </header>

      {walletSummary.isLoading && (
        <div className="rounded-2xl border border-[#e6ece9] bg-white p-6 text-[#6f7f7b]">جاري تحميل بيانات المحفظة...</div>
      )}

      {summary && <WalletSummaryCards summary={summary} role={walletRole} />}

      <WalletIncomeChart />

      {walletRole === "patient" && <WalletPaymentsTable payments={patientPayments.data?.data ?? []} />}

      <WalletTransactionsTable
        title="الحركات المالية"
        subtitle="سجل كامل بكل إيداعات الجلسات وطلبات السحب"
        transactions={transactionRows}
      />

      <section className="rounded-3xl border border-[#e6ece9] bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-2xl font-bold">طرق السحب المحفوظة</h3>
          <button type="button" className="text-sm text-[#19a97d] hover:underline">إدارة كل الطرق</button>
        </div>

        <div className="grid gap-3 lg:grid-cols-3">
          <div className="rounded-2xl border border-[#e7efec] bg-[#f8fbfa] p-4">
            <p className="text-xs text-[#89a19a]">افتراضي</p>
            <p className="mt-1 font-semibold">بنك مسقط</p>
            <p className="mt-2 text-xs text-[#8da39d]">IBAN 4133 **** ****</p>
          </div>
          <div className="rounded-2xl border border-[#e7efec] bg-[#f8fbfa] p-4">
            <p className="text-xs text-[#89a19a]">محفظة رقمية</p>
            <p className="mt-1 font-semibold">محفظة فوري</p>
            <p className="mt-2 text-xs text-[#8da39d]">9686 **** ****</p>
          </div>
          <button
            type="button"
            className="flex min-h-24 items-center justify-center rounded-2xl border border-dashed border-[#c8d6d1] text-[#7b908a] transition hover:border-[#8db9ae] hover:text-[#355f55]"
          >
            إضافة طريقة سحب +
          </button>
        </div>
      </section>

      {pagination && (
        <div className="flex items-center justify-between rounded-xl border border-[#e6ece9] bg-white px-4 py-3">
          <p className="text-sm text-[#60716d]">
            صفحة {pagination.current_page} من {pagination.last_page}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="rounded-xl"
              disabled={page <= 1}
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            >
              السابق
            </Button>
            <Button
              variant="outline"
              className="rounded-xl"
              disabled={page >= pagination.last_page}
              onClick={() => setPage((prev) => prev + 1)}
            >
              التالي
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
