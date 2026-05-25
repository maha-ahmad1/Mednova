import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Scale, AlertCircle, CheckCircle2 } from "lucide-react";

interface DisputeSummaryCardsProps {
  totalFrozenAmount: string;
  totalOpen: number;
  totalResolved: number;
  isLoading: boolean;
}

export function DisputeSummaryCards({
  totalFrozenAmount,
  totalOpen,
  totalResolved,
  isLoading,
}: DisputeSummaryCardsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            إجمالي المبلغ المجمد
          </CardTitle>
          <Scale className="h-4 w-4 text-purple-500" />
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-purple-700">{totalFrozenAmount}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            النزاعات المفتوحة
          </CardTitle>
          <AlertCircle className="h-4 w-4 text-amber-500" />
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-amber-700">{totalOpen}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            النزاعات المحلولة
          </CardTitle>
          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-emerald-700">{totalResolved}</p>
        </CardContent>
      </Card>
    </div>
  );
}
