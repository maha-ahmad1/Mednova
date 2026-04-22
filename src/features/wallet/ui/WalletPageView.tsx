"use client";

import { Button } from "@/components/ui/button";
import { useWalletData } from "../hooks/useWalletData";
import { WalletSummaryCards } from "./WalletSummaryCards";
import { WalletTransactionsTable } from "./WalletTransactionsTable";
import { WalletPaymentsTable } from "./WalletPaymentsTable";

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

  if (!walletRole) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-800">
        لا يمكن عرض المحفظة لهذا النوع من الحساب.
      </div>
    );
  }

  const summary = walletSummary.data;

  const pagination =
    (walletRole === "consultant" ? consultantTransactions.data : patientTransactions.data)?.meta ??
    (walletRole === "consultant" ? consultantTransactions.data : patientTransactions.data)?.pagination;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">المحفظة المالية</h1>
        <p className="mt-1 text-sm text-gray-500">ملخص الرصيد وسجل العمليات المالية.</p>
      </div>

      {walletSummary.isLoading && (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 text-gray-500">جاري تحميل بيانات المحفظة...</div>
      )}

      {summary && <WalletSummaryCards summary={summary} role={walletRole} />}

      {walletRole === "consultant" && (
        <WalletTransactionsTable
          title="سجل معاملات المستشار"
          transactions={consultantTransactions.data?.data ?? []}
        />
      )}

      {walletRole === "patient" && (
        <>
          <WalletPaymentsTable payments={patientPayments.data?.data ?? []} />
          <WalletTransactionsTable
            title="سجل المعاملات المالية"
            transactions={patientTransactions.data?.data ?? []}
          />
        </>
      )}

      {pagination && (
        <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3">
          <p className="text-sm text-gray-600">
            صفحة {pagination.current_page} من {pagination.last_page}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              disabled={page <= 1}
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            >
              السابق
            </Button>
            <Button
              variant="outline"
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
