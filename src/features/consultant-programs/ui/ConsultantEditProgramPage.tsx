"use client";

import { ArrowLeft } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useConsultantProgramDetail } from "../hooks/useConsultantProgramDetail";
import { ConsultantProgramForm } from "./ConsultantProgramForm";

interface ConsultantEditProgramPageProps {
  programId: number;
}

export function ConsultantEditProgramPage({ programId }: ConsultantEditProgramPageProps) {
  const { data, isLoading, isError } = useConsultantProgramDetail(programId);
  const program = data?.data;

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-5xl space-y-4 p-4 sm:p-6">
        <Skeleton className="h-10 w-44" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (isError || !program) {
    return (
      <div className="mx-auto w-full max-w-5xl p-4 sm:p-6">
        <Card>
          <CardContent className="space-y-3 pt-6 text-center">
            <p className="font-medium text-destructive">تعذر تحميل بيانات الكورس.</p>
            <Button asChild variant="outline">
              <Link href="/profile/programs">العودة إلى كورساتي</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl space-y-5 p-4 sm:p-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">تحديث الكورس</h1>
          <p className="text-sm text-muted-foreground">
            قم بتحديث بيانات الكورس وإدارة فيديوهاته ومتابعة مبيعاته.
          </p>
        </div>
        <Button asChild variant="outline" className="gap-2">
          <Link href="/profile/programs">
            <ArrowLeft className="h-4 w-4" />
            رجوع
          </Link>
        </Button>
      </div>

      <ConsultantProgramForm mode="edit" program={program} />
    </div>
  );
}
