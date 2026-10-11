"use client";

import { ArrowLeft } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { classifyApiError } from "@/lib/classifyApiError";
import { ErrorState } from "@/shared/ui/components/states/ErrorState";
import { useConsultantProgramDetail } from "../hooks/useConsultantProgramDetail";
import { ConsultantProgramForm } from "./ConsultantProgramForm";
import { ConsultantProgramFormSkeleton } from "./components/ConsultantProgramFormSkeleton";

interface ConsultantEditProgramPageProps {
  programId: number;
}

export function ConsultantEditProgramPage({ programId }: ConsultantEditProgramPageProps) {
  const { data, isLoading, isError, error, refetch } = useConsultantProgramDetail(programId);
  const program = data?.data;

  if (isLoading) {
    return <ConsultantProgramFormSkeleton />;
  }

  if (isError || !program) {
    const { title, message } = isError
      ? classifyApiError(error)
      : { title: "حدث خطأ", message: "تعذر تحميل بيانات الكورس." };

    return (
      <div className="mx-auto w-full max-w-5xl space-y-3 p-4 sm:p-6">
        <ErrorState
          title={title}
          description={message}
          onRetry={() => refetch()}
        />
        <Card>
          <CardContent className="space-y-3 pt-6 text-center">
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
