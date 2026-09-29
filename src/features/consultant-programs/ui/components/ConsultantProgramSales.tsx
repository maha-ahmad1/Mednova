"use client";

import { DollarSign, ShoppingBag } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { CurrencyAmount, WalletStatCard } from "@/features/financial/ui/shared";
import { useConsultantProgramSales } from "../../hooks/useConsultantProgramSales";

interface ConsultantProgramSalesProps {
  programId: number;
}

export function ConsultantProgramSales({ programId }: ConsultantProgramSalesProps) {
  const { data, isLoading } = useConsultantProgramSales(programId);
  const sales = data?.data;

  const hasSales = (sales?.sales_count ?? 0) > 0;

  return (
    <Card>
      <CardContent className="space-y-4 p-5">
        <h3 className="text-lg font-bold text-foreground">المبيعات</h3>

        <div className="flex flex-wrap gap-3">
          <WalletStatCard
            icon={<ShoppingBag className="h-4 w-4 text-[#32A88D]" />}
            iconBg="bg-[#32A88D]/10"
            label="عدد المبيعات"
            value={String(sales?.sales_count ?? 0)}
            isLoading={isLoading}
          />
          <WalletStatCard
            icon={<DollarSign className="h-4 w-4 text-emerald-600" />}
            iconBg="bg-emerald-100"
            label="إجمالي الأرباح"
            value={sales ? Number(sales.total_earnings).toLocaleString("en-US", { minimumFractionDigits: 3, maximumFractionDigits: 3 }) : "0.000"}
            unit="OMR"
            isLoading={isLoading}
          />
        </div>

        {!isLoading && !hasSales && (
          <p className="rounded-lg border border-dashed p-4 text-center text-sm text-muted-foreground">
            لا توجد مبيعات لهذا الكورس بعد.
          </p>
        )}

        {!isLoading && hasSales && sales && sales.by_month.length > 0 && (
          <div className="overflow-hidden rounded-lg border">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-muted-foreground">
                <tr>
                  <th className="px-3 py-2 text-right font-medium">الشهر</th>
                  <th className="px-3 py-2 text-right font-medium">عدد المبيعات</th>
                  <th className="px-3 py-2 text-right font-medium">الأرباح</th>
                </tr>
              </thead>
              <tbody>
                {sales.by_month.map((row) => (
                  <tr key={row.month} className="border-t">
                    <td className="px-3 py-2">{row.month}</td>
                    <td className="px-3 py-2">{row.sales_count}</td>
                    <td className="px-3 py-2">
                      <CurrencyAmount amount={Number(row.earnings)} size="sm" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
